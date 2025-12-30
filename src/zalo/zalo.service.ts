import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import PQueue from 'p-queue';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ZaloService implements OnModuleDestroy {
  private readonly logger = new Logger(ZaloService.name);

  private browser: Browser | null = null;
  private page: Page | null = null;
  private startingPromise: Promise<void> | null = null;

  private started = false;
  private loggedIn = false;

  private readonly sessionDir = path.join(process.cwd(), 'zalo-session');

  private activeGroup: string | null = null;

  /** chống spam + giữ thứ tự */
  private readonly queue = new PQueue({
    concurrency: 1,
    interval: 1000,
    intervalCap: 5,
  });

  /* ================= PUBLIC ================= */

  /**
   * START puppeteer – gọi 1 lần khi app boot
   */
  async start() {
    if (this.browser) return;

    if (this.startingPromise) {
      await this.startingPromise;
      return;
    }

    this.startingPromise = (async () => {
      await this.initBrowser();
      await this.openZalo();
      await this.ensureLogin();
    })();

    try {
      await this.startingPromise;
    } finally {
      this.startingPromise = null;
    }
  }

  async sendToGroup(groupName: string, message: string) {
    try {
      return this.queue.add(async () => {
        await this.ensureAlive();
        await this.ensureGroup(groupName);
        await this.sendMessage(message);
        // await this.waitForMessageRendered(message);
      });
    } catch (err) {
      this.logger.error('Failed to send message to group', err);
    }
  }

  /* ================= LIFECYCLE ================= */

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /* ================= CORE ================= */

  private async initBrowser() {
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }

    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: true, // production
      userDataDir: this.sessionDir,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(30_000);

    this.logger.log('Browser initialized');
  }

  private async openZalo() {
    await this.page!.goto('https://chat.zalo.me', {
      waitUntil: 'networkidle2',
    });
  }

  private async ensureLogin() {
    try {
      await this.page?.waitForSelector('#contact-search-input', {
        visible: true,
        timeout: 20000,
      });

      this.loggedIn = true;
      this.logger.log('Zalo logged in (session valid)');
    } catch {
      this.loggedIn = false;
      // throw new Error('Zalo session invalid or expired');
    }
  }

  private async ensureAlive() {
    if (!this.browser || !this.page) {
      await this.start();
      return;
    }

    if (this.page.isClosed()) {
      this.logger.warn('Page closed, reopening');
      this.page = await this.browser.newPage();
      await this.openZalo();
      await this.ensureLogin();
    }
  }

  /* ================= GROUP ================= */

  private async ensureGroup(groupName: string) {
    if (this.activeGroup === groupName) return;

    await this.openGroupByName(groupName);
    this.activeGroup = groupName;
  }

  private async openGroupByName(groupName: string) {
    this.logger.log('Waiting for Zalo UI...', this.page?.url());
    await this.page?.screenshot({
      path: `zalo-ui-${Date.now()}.png`,
    });

    await this.page!.waitForSelector('#contact-search-input', {
      visible: true,
    });

    const input = await this.page!.$('#contact-search-input');
    if (!input) throw new Error('Search input not found');

    await input.click({ clickCount: 3 });
    await this.page!.keyboard.press('Backspace');
    await input.type(groupName, { delay: 80 });

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const items = await this.page!.$$('div[id^="group-item-"]');
    if (!items.length) {
      throw new Error(`Group not found: ${groupName}`);
    }

    await items[0].click();

    await this.page!.waitForSelector('div[contenteditable="true"]', {
      visible: true,
    });

    this.logger.log(`Group opened: ${groupName}`);
  }

  /* ================= MESSAGE ================= */

  private async sendMessage(message: string) {
    const input = await this.page!.waitForSelector(
      'div[contenteditable="true"]',
    );

    await input!.click();
    await this.page!.keyboard.type(message, { delay: 10 });
    await this.page!.keyboard.press('Enter');
    this.logger.log('Message sent (keyboard)');
  }

  /**
   * Best-effort ACK: đợi message xuất hiện trong DOM
   */
  private async waitForMessageRendered(message: string) {
    try {
      await this.page!.waitForFunction(
        (text) => {
          const nodes = document.querySelectorAll('div');
          return Array.from(nodes).some((n) => n.textContent?.includes(text));
        },
        { timeout: 5000 },
        message,
      );
      this.logger.log('Message rendered in chat');
    } catch (err) {
      this.logger.warn(
        'Message sent but could not verify render (acceptable)',
        err,
      );
    }
  }
}
