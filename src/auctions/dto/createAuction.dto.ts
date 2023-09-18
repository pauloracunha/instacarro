import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuctionStatusEnum } from './auctionStatus.enum';

export class CreateAuctionDto {
  @IsString()
  @ApiProperty({
    description: 'Product id',
  })
  product?: string;

  @IsEnum(AuctionStatusEnum)
  @IsOptional()
  @ApiProperty()
  status?: AuctionStatusEnum;
}
