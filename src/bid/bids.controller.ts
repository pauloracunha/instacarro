import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { RequestWithUser } from 'src/auth/dto/request.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Types } from 'mongoose';
import { CreateBidDto } from './dto/createBid.dto';

@ApiTags('Bids')
@ApiCookieAuth(process.env.ACCESS_TOKEN_COOKIE_NAME)
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async create(
    @Body() bid: CreateBidDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { auction, amount } = bid;
    if (!Types.ObjectId.isValid(auction)) {
      throw new BadRequestException('auction is not a valid id!');
    }
    const bidCreated = await this.bidsService.create(
      { amount },
      auction,
      req.user.id,
    );
    return res.status(HttpStatus.CREATED).json(bidCreated);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser, @Res() res: Response) {
    const bids = await this.bidsService.findAll(req.user.id);
    return res.json(bids);
  }
}
