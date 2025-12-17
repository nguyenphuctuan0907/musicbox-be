import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishType } from 'generated/prisma/enums';
import { CreateDishDto } from './dto/create-dish.dto';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  async getAllDishes(@Query('type') type: DishType) {
    return this.dishService.getAllDishes(type);
  }

  @Post()
  async createDish(@Body() createDishDto: CreateDishDto) {
    return this.dishService.createDish(createDishDto);
  }
}
