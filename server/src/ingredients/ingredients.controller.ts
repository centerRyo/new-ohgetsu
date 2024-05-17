import { Controller, Get } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientDto } from './ingredients.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  async findAll(): Promise<IngredientDto[]> {
    const ingredients = await this.ingredientsService.findAll();

    return ingredients;
  }
}
