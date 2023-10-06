import { Body, Controller, Get, Post, Put, Delete, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { Reservations } from './reservations.entity';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  async findAll(): Promise<Reservations[]> {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Reservations> {
    return this.reservationsService.findOne(id);
  }

  @Get('/email/:email')
  async findOneByUsername(@Param('email') email: string): Promise<Reservations> {
    return this.reservationsService.findOneByEmail(email);
  }

  @Post()
  @HttpCode(201) 
  async create(@Body() reservation: Reservations): Promise<Reservations> {
    const createdReservation = await this.reservationsService.create(reservation);
    return createdReservation;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (@Param('id') id: number, @Body() reservation: Reservations): Promise<any> {
    await this.reservationsService.update(id, reservation);
    return { message: 'Reservation updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.reservationsService.findOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    await this.reservationsService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
