import { Injectable, NotFoundException } from '@nestjs/common';
import { Auction, AuctionDocument } from './entities/auction.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { AuctionFilters } from './auctionFilters';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private productsService: ProductsService,
  ) {}

  async create(auction: Auction, productId: string, userId: string) {
    const productFromUser = await this.productsService.findOne(
      productId,
      userId,
    );
    if (!productFromUser) {
      throw new NotFoundException('Product not found!');
    }
    const auctionSaved = await this.auctionModel
      .findOneAndUpdate(
        {
          product: productId,
        },
        auction,
        { upsert: true },
      )
      .exec();
    await this.productsService.update(
      productId,
      { auction: auctionSaved },
      userId,
    );
    return auctionSaved;
  }

  async findAll(filtersParams: AuctionFilters, userId: string) {
    const filter: FilterQuery<AuctionDocument> = {};
    if (filtersParams?.byMe) {
      filter._id = (await this.productsService.findAll(userId))
        .map(({ auction }) => auction ?? undefined)
        .filter((auction) => !!auction);
    }
    const auctionsQuery = this.auctionModel
      .find(filter)
      .populate('product', 'title description category images');
    return await auctionsQuery.exec();
  }

  async findOne(id: string) {
    return await this.auctionModel
      .findById(id)
      .populate('product', 'title description category images');
  }

  async update(
    id: string,
    auction: Omit<Partial<Auction>, 'product'>,
    userId: string,
  ) {
    const auctionSearch = await this.findOne(id);
    // eslint-disable-next-line
    // @ts-ignore
    if (auctionSearch.product.user._id != userId) {
      throw new NotFoundException('Auction not found!');
    }
    const auctionUpdated = await this.auctionModel
      .findByIdAndUpdate(id, auction)
      .exec();
    return auctionUpdated.toObject();
  }

  async remove(id: string, userId: string) {
    const auctionSearch = (await this.findOne(id)).populate('product.user');
    // eslint-disable-next-line
    // @ts-ignore
    if (auctionSearch.product.user != userId) {
      throw new NotFoundException('Auction not found!');
    }
    const objId = new mongoose.Types.ObjectId(id);
    const deleted = await this.auctionModel.deleteOne({ _id: objId });
    return deleted.deletedCount === 1;
  }
}
