import puppeteer from 'puppeteer';

async function login() {
  const browser = await puppeteer.launch({
    headless: false, // BẮT BUỘC
    userDataDir: './zalo-session', // LƯU SESSION
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto('https://chat.zalo.me', {
    waitUntil: 'networkidle2',
  });

  console.log('➡️ Vui lòng QUÉT MÃ QR trong trình duyệt...');

  // Đợi Zalo đăng nhập xong
  await page.waitForFunction(() => location.href.includes('chat.zalo.me'), {
    timeout: 0,
  });

  console.log('✅ Đăng nhập thành công!');
}

login();
