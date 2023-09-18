import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(
    product: Omit<Product, 'user'>,
    userId: string,
  ): Promise<Product> {
    const createdProduct = new this.productModel({
      ...product,
      user: userId,
    });
    return await createdProduct.save();
  }

  async findAll(userId: string): Promise<Product[]> {
    const products = await this.productModel
      .find({
        user: userId,
      })
      .exec();
    return products;
  }

  async findOne(id: string, userId: string): Promise<Product> {
    const products = await this.productModel
      .findOne({
        _id: id,
        user: userId,
      })
      .exec();
    return products;
  }

  async update(
    id: string,
    product: Partial<Product>,
    userId: string,
  ): Promise<Product> {
    const productUpdated = await this.productModel
      .findOneAndUpdate({ _id: id, user: userId }, product, { new: true })
      .exec();
    return productUpdated.toObject();
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const productFromUser = await this.findOne(id, userId);
    if (!productFromUser) {
      throw new NotFoundException('Product not found!');
    }
    const objId = new Types.ObjectId(id);
    const deleted = await this.productModel.deleteOne({ _id: objId });
    return deleted.deletedCount === 1;
  }
}
