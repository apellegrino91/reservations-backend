import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservations } from './reservations.entity';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reservations])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}