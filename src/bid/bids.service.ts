import { BadRequestException, Injectable } from '@nestjs/common';
import { Bid, BidDocument } from './entities/bid.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBidDto } from './dto/createBid.dto';
import { AuctionsService } from 'src/auctions/auctions.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    private auctionsService: AuctionsService,
  ) {}

  async create(bid: CreateBidDto, auctionId: string, userId: string) {
    const isAuctionAcceptBids = await this.auctionsService.isAcceptBids(
      auctionId,
    );
    if (!isAuctionAcceptBids) {
      throw new BadRequestException('This auction is not accepting bids');
    }
    const bidCreated = await new this.bidModel({
      ...bid,
      auction: auctionId,
      user: userId,
    }).save();
    return bidCreated;
  }

  async findAll(userId: string) {
    const bidsQuery = this.bidModel
      .find({
        user: userId,
      })
      .populate('bid.auction.product', 'title description category images')
      .populate('bid');
    return await bidsQuery.exec();
  }
}
