import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/products/entities/product.entity';

export type UserDocument = User & mongoose.Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  })
  products?: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
