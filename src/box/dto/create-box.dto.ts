/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, IsEnum } from 'class-validator';
import { BoxSize } from 'generated/prisma/enums';

export class CreateBoxDto {
  @IsString()
  name: string;

  @IsEnum(BoxSize)
  size: BoxSize;

  @IsNumber()
  defaultPricePerHour: number;
}
