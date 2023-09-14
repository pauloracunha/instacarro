import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async exists(user: Pick<User, 'email'>) {
    const userExists = await this.userModel.count(user).exec();
    return userExists > 0;
  }

  async findOne(user: Pick<User, 'email'>) {
    console.log(
      '🚀 ~ file: users.service.ts:16 ~ UsersService ~ findOne ~ user:',
      user,
    );
    const userFound = await this.userModel.findOne(user);
    return userFound.toObject();
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async create(user: User) {
    const createdUser = new this.userModel(user);
    return (await createdUser.save()).toObject();
  }
}
