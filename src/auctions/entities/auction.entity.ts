import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/products/entities/product.entity';

export type AuctionDocument = Auction & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Auction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  product?: Product;

  @Prop()
  status?: string;

  @Prop()
  startBidAt: string;

  @Prop()
  endBidAt: string;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
