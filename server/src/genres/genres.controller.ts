import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenreDto } from './genres.dto';
import { GenresService } from './genres.service';

@Controller('genres')
@ApiTags('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({
    summary: 'ジャンルを取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [GenreDto] })
  async findAll(): Promise<GenreDto[]> {
    const genres = await this.genresService.findAll();

    return genres;
  }
}
