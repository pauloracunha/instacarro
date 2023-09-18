import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/users/entities/user.entity';

export type BidDocument = Bid & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Bid {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  })
  auction: Auction;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.Number,
  })
  amount: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
