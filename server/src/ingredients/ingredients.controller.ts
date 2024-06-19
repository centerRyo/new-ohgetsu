import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngredientDto } from './ingredients.dto';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @ApiOperation({
    summary: '原材料を取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [IngredientDto] })
  async findAll(): Promise<IngredientDto[]> {
    const ingredients = await this.ingredientsService.findAll();

    return ingredients;
  }
}
