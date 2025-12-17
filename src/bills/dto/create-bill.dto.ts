import { IsOptional } from 'class-validator';

export class CreateBillDTO {
  boxId: number;
  creatorId: number;

  @IsOptional()
  subtotal: number;

  @IsOptional()
  discountAmount: number;

  @IsOptional()
  total: number;
}
