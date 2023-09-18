import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import * as mongoose from 'mongoose';
import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/users/entities/user.entity';

export type ProductDocument = Product & mongoose.Document;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: '{PATH} is required!' })
  title: string;

  @Prop()
  category?: string;

  @Prop()
  description?: string;

  @Prop()
  images?: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  })
  auction?: Auction;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
