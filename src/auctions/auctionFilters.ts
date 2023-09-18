import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class AuctionFilters {
  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  byMe?: boolean;
}
