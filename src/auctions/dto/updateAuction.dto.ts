import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuctionDto {
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
