import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AuctionStatusEnum } from './auctionStatus.enum';

export class UpdateAuctionDto {
  @IsEnum(AuctionStatusEnum)
  @IsOptional()
  @ApiProperty()
  status?: AuctionStatusEnum;
}
