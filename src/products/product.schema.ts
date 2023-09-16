import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: '{PATH} is required!' })
  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string;

  @Prop()
  @IsString()
  @IsOptional()
  @ApiProperty()
  category?: string;

  @Prop()
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @Prop()
  @IsArray()
  @IsOptional()
  @ApiProperty()
  images?: string[];

  @Prop({
    type: {
      type: Types.ObjectId,
      ref: 'User',
    },
  })
  user: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
