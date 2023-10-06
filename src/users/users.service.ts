import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOneByUsername(username: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({"username": Equal(username)});
  }

  findOne(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(reservation: Partial<Users>): Promise<Users> {
    const newUser = this.usersRepository.create(reservation);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.usersRepository.update(id, user);
    return this.usersRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}