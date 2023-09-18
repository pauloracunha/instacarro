import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './entities/bid.entity';
import { AuctionsService } from 'src/auctions/auctions.service';
import { Auction, AuctionSchema } from 'src/auctions/entities/auction.entity';
import { ProductsService } from 'src/products/products.service';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [BidsController],
  providers: [BidsService, AuctionsService, ProductsService],
})
export class BidsModule {}
