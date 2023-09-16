import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';
import { RequestWithUser } from 'src/auth/dto/request.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Types } from 'mongoose';

@ApiTags('Products')
@ApiCookieAuth(process.env.ACCESS_TOKEN_COOKIE_NAME)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() product: Product,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { title, category, description, images } = product;
    const productCreated = this.productsService.create(
      {
        title,
        category,
        description,
        images,
      },
      req.user.id,
    );
    return res.status(HttpStatus.CREATED).json(productCreated);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser, @Res() res: Response) {
    const products = await this.productsService.findAll(req.user.id);
    return res.json(products);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Product not found!');
    }
    const products = await this.productsService.findOne(id, req.user.id);
    return res.json(products);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Product not found!');
    }
    const product = await this.productsService.update(
      id,
      updateProductDto,
      req.user.id,
    );
    return res.json(product);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Product not found!');
    }
    await this.productsService.remove(id, req.user.id);
    return res.json({
      id,
      removed: true,
    });
  }
}
