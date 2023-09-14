import {
  Injectable,
  Dependencies,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/singup.dto';

@Injectable()
@Dependencies(UsersService, JwtService)
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email } = signUpDto;
    const userExists = await this.usersService.exists({ email });
    if (userExists) {
      throw new HttpException('User already exists', 400);
    }
    const hashedPassword = await this.bcrypt(signUpDto.password);
    const { password, ...user } = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });
    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    const isValidePassword = await bcrypt.compare(pass, user?.password);
    if (!isValidePassword) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user; // eslint-disable-line
    return result;
  }

  async signIn(user) {
    const payload = { email: user.email, sub: user._id };
    return {
      [process.env.ACCESS_TOKEN_COOKIE_NAME]: await this.jwtService.signAsync(
        payload,
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
        },
      ),
    };
  }

  async getProfile(user) {
    const { password, ...result } = await this.usersService.findOne({
      email: user.email,
    });
    return result;
  }

  async bcrypt(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
}
