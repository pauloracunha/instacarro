import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @ApiProperty({
    description: 'Product id',
  })
  product?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  startBidAt: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  endBidAt: string;
}
