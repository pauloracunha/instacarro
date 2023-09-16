import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(product: Omit<Product, 'user'>, userId: string) {
    const createdProduct = new this.productModel({
      ...product,
      user: userId,
    });
    const productCreated = await createdProduct.save();
    const user = await this.userModel.findById(userId).exec();
    user.products.push(createdProduct);
    await user.save();

    return productCreated.toObject();
  }

  async findAll(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('products', null, Product.name)
      .exec();
    return user.products;
  }

  async findOne(id: string, userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('products', null, Product.name, {
        _id: id,
      })
      .exec();
    return user.products[0];
  }

  async update(id: string, product: Partial<Product>, userId: string) {
    const productFromUser = await this.findOne(id, userId);
    if (!productFromUser) {
      throw new NotFoundException('Product not found!');
    }
    const productUpdated = await this.productModel
      .findByIdAndUpdate(id, product)
      .exec();
    return productUpdated.toObject();
  }

  async remove(id: string, userId: string) {
    const productFromUser = await this.findOne(id, userId);
    if (!productFromUser) {
      throw new NotFoundException('Product not found!');
    }
    await this.productModel.findByIdAndRemove(id).exec();
    return true;
  }
}
