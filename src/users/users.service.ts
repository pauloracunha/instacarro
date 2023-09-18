import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async exists(user: Pick<User, 'email'>): Promise<boolean> {
    const userExists = await this.userModel.count(user).exec();
    return userExists > 0;
  }

  async findOne(user: Pick<User, 'email'>): Promise<User> {
    const userFound = await this.userModel.findOne(user).exec();
    return userFound.toObject();
  }

  async findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return (await createdUser.save()).toObject();
  }
}
