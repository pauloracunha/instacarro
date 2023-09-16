import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/products/product.schema';

export type UserDocument = HydratedDocument<User>;

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
    type: [Types.ObjectId],
    ref: 'Product',
  })
  products?: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
