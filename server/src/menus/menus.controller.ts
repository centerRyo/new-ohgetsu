import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { DeleteMenuDto } from './delete-menu.dto';
import { MenuDto, findMenusQuery } from './menus.dto';
import { MenusService } from './menus.service';
import { ParsePdfDto, ParsePdfResultDto } from './parse-pdf.dto';
import { PdfParseService } from './pdf-parse.service';
import { UpdateMenuDto } from './update-menu.dto';

/** アップロード可能なPDFの上限サイズ(10MB) */
const MAX_PDF_SIZE = 10 * 1024 * 1024;

@Controller('menus')
@ApiTags('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
    private readonly pdfParseService: PdfParseService
  ) {}

  @Get()
  @ApiOperation({
    summary: '指定されたアレルギー情報を含まないメニュー一覧を取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [MenuDto] })
  async findAll(@Query() query: findMenusQuery): Promise<MenuDto[]> {
    const menus = await this.menusService.findAll(query);

    return menus.map((menu) => new MenuDto(menu));
  }

  @Get(':id')
  @ApiOperation({
    summary: '指定されたメニューを取得する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: MenuDto })
  async findOne(@Param('id') id: string): Promise<MenuDto> {
    const menu = await this.menusService.findOne(id);

    return new MenuDto(menu);
  }

  @Post()
  @ApiOperation({
    summary: 'アレルギー情報を含んだメニューを作成する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [MenuDto] })
  @ApiBody({ type: CreateMenuDto })
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() data: CreateMenuDto): Promise<MenuDto[]> {
    const menus = await this.menusService.create(data);

    return menus.map((menu) => new MenuDto(menu));
  }

  @Post('parse-pdf')
  @ApiOperation({
    summary: 'アレルゲン表PDFを解析してメニュー候補を返す',
    description:
      'テキスト埋め込みのアレルゲン表PDFを座標ベースで解析し、メニュー×アレルゲンの候補を返す。DB登録はせず、フロントで確認・修正後に POST /menus で登録する。',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ParsePdfResultDto })
  @ApiBody({ type: ParsePdfDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE } })
  )
  async parsePdf(
    @UploadedFile() file?: Express.Multer.File
  ): Promise<ParsePdfResultDto> {
    if (!file) {
      throw new BadRequestException('PDFファイルが添付されていません');
    }
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname?.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      throw new BadRequestException('PDFファイルをアップロードしてください');
    }

    return this.pdfParseService.parsePdf(file.buffer);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'メニューを更新する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: MenuDto })
  @ApiBody({ type: UpdateMenuDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('pic'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateMenuDto,
    @UploadedFile() pic?: Express.Multer.File
  ): Promise<MenuDto> {
    const menu = await this.menusService.update(id, data, pic);

    return new MenuDto(menu);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'メニューを削除する',
    description: '指定したIDのメニューを物理削除する',
  })
  @ApiResponse({ status: HttpStatus.OK, type: DeleteMenuDto })
  async remove(@Param('id') id: string): Promise<DeleteMenuDto> {
    await this.menusService.remove(id);

    return new DeleteMenuDto({ result: true });
  }
}
