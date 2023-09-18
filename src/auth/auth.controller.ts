import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/singup.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestWithUser } from './dto/request.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/singin.dto';
import { User } from 'src/users/entities/user.entity';
import { time } from 'console';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('singup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { email, name, password } = signUpDto;
    const userCreated = await this.authService.signUp({
      email,
      name,
      password,
    });
    return res.status(HttpStatus.CREATED).json(userCreated);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('singin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const auth = await this.authService.signIn(req.user);
    res.cookie(
      process.env.ACCESS_TOKEN_COOKIE_NAME,
      auth[process.env.ACCESS_TOKEN_COOKIE_NAME],
      {
        httpOnly: true,
      },
    );
    return res.sendStatus(HttpStatus.OK);
  }

  @ApiCookieAuth(process.env.ACCESS_TOKEN_COOKIE_NAME)
  @Post('logout')
  async signOut(@Res() res: Response) {
    return res
      .clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME)
      .sendStatus(HttpStatus.OK);
  }

  @ApiCookieAuth(process.env.ACCESS_TOKEN_COOKIE_NAME)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user);
  }
}
