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
import { AuctionsService } from './auctions.service';
import { RequestWithUser } from 'src/auth/dto/request.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AuctionFilters } from './auctionFilters';
import { CreateAuctionDto } from './dto/createAuction.dto';
import { UpdateAuctionDto } from './dto/updateAuction.dto';

@ApiTags('Auctions')
@ApiCookieAuth(process.env.ACCESS_TOKEN_COOKIE_NAME)
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  async create(
    @Body() auction: CreateAuctionDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { product, status } = auction;
    if (!Types.ObjectId.isValid(product)) {
      throw new BadRequestException('productId is not a valid id!');
    }
    const auctionCreated = await this.auctionsService.create(
      { status },
      product,
      req.user.id,
    );
    return res.status(HttpStatus.CREATED).json(auctionCreated);
  }

  @Get()
  async findAll(
    @Param() params: AuctionFilters,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const auctions = await this.auctionsService.findAll(params, req.user.id);
    return res.json(auctions);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Auction not found!');
    }
    const auctions = await this.auctionsService.findOne(id);
    return res.json(auctions);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Auction not found!');
    }
    const auction = await this.auctionsService.update(
      id,
      updateAuctionDto,
      req.user.id,
    );
    return res.json(auction);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Auction not found!');
    }
    await this.auctionsService.remove(id, req.user.id);
    return res.json({
      id,
      removed: true,
    });
  }
}
