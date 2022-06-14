import { Module } from '@nestjs/common';
import { PartyService } from './party.service';
import { PartyController } from './party.controller';

@Module({
  providers: [PartyService],
  controllers: [PartyController]
})
export class PartyModule {}
