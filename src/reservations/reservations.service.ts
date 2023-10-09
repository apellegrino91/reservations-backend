import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Reservations } from './reservations.entity';

@Injectable()
export class ReservationsService {

  constructor(
    @InjectRepository(Reservations)
    private reservationsRepository: Repository<Reservations>,
  ) {}

  findAll(): Promise<Reservations[]> {
    return this.reservationsRepository.find();
  }

  findOne(id: number): Promise<Reservations | null> {
    return this.reservationsRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<Reservations | null> {
    return this.reservationsRepository.findOneBy({"email": Equal(email)});
  }

  async create(reservation: Partial<Reservations>): Promise<Reservations> {
    const newReservation = this.reservationsRepository.create(reservation);
    return this.reservationsRepository.save(newReservation);
  }

  async update(id: number, reservation: Partial<Reservations>): Promise<Reservations> {
    await this.reservationsRepository.update(id, reservation);
    return this.reservationsRepository.findOne({ where: { id } });
  }
  
  async delete(id: number): Promise<boolean> {
    const result = await this.reservationsRepository.delete(id);
    return result.affected != null && result.affected > 0;
  }
}