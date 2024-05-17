import { Controller, Get } from '@nestjs/common';
import { GenreDto } from './genres.dto';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}
  @Get()
  async findAll(): Promise<GenreDto[]> {
    const genres = await this.genresService.findAll();

    return genres;
  }
}
