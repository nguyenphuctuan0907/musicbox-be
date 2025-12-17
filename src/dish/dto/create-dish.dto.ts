import { DishType } from 'generated/prisma/enums';

export class CreateDishDto {
  name: string;
  price: number;
  type: DishType;
}
