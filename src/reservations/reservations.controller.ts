import { Body, Controller, Get, Post, Put, Delete, HttpCode, NotFoundException, Param, UseGuards, ConflictException, BadRequestException } from '@nestjs/common';
import { Reservations } from './reservations.entity';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  async findAll(): Promise<Reservations[]> {
     const reservations = this.reservationsService.findAll();
     if (reservations == null) {
      throw new NotFoundException("Reservations not found");
     }
    return reservations;
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Reservations> {
    const reservation = await this.reservationsService.findOne(id);
    if (reservation == null) {
      throw new NotFoundException("Reservation not found.");
    }
    return reservation;
  }

  @Get('/email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<Reservations> {
    const reservation = await this.reservationsService.findOneByEmail(email);
    if (reservation == null) {
      throw new NotFoundException("Reservation not found.");
    }
    return reservation;
  }

  @Post()
  @HttpCode(201) 
  async create(@Body() reservation: Reservations): Promise<Reservations> {
    const createdReservation = await this.reservationsService.create(reservation);
    if (createdReservation == null) {
      throw new ConflictException("Reservation not created");
    }
    return createdReservation;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update (@Param('id') id: number, @Body() reservation: Reservations): Promise<any> {
    const updatedReservation = await this.reservationsService.update(id, reservation);
    if (updatedReservation == null) {
      throw new BadRequestException("Reservation not updated.");
    }

    return updatedReservation;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.reservationsService.findOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    const result = await this.reservationsService.delete(id);
    if (!result) {
      throw new BadRequestException("Reservation not deleted.");
    }
    return { message: 'Reservation deleted successfully' };
  }
}
