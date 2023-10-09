import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum ReservationStatus {
  Booked,
  Confirmed,
  Canceled
}

@Entity()
export class Reservations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phone: string;

  @Column()
  status: ReservationStatus;

  @Column()
  date: number;
}