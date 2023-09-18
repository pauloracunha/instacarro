import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let usersService: UsersService;
  let user: User & {
    _id: Types.ObjectId;
  } & Required<{
      _id: Types.ObjectId;
    }>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    user = await usersService.create({
      name: 'Test user',
      email: 'test@test.com',
      password: 'TestPass',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create a product', () => {
    const product: Omit<Product, 'user'> = {
      title: 'Test product',
    };
    expect(service.create(product, user._id.toString())).toBe(product);
  });
});
