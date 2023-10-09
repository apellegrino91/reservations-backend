import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { UserResponse, Users } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersRepository.find();
    var reducedUsers : UserResponse[] = [];
    users.forEach(element => {
      reducedUsers.push({id: element.id, username: element.username});
    });

    return reducedUsers;
  }

  async findOneByUsername(username: string): Promise<Users | null> {
    return await this.usersRepository.findOneBy({"username": Equal(username)});
  }

  async findOne(id: number): Promise<UserResponse | null> {
    const user = await this.usersRepository.findOneBy({ id });
    return {id: user.id, username: user.username};
  }

  async create(user: Partial<Users>): Promise<UserResponse> {
    const hashed = await bcrypt.hash(user.password!, 10);
    user.password = hashed;
    const newUser = this.usersRepository.create(user);
    const received = await this.usersRepository.save(newUser);
    return {id: received.id, username: received.username};
  }

  async update(id: number, user: Partial<Users>): Promise<UserResponse> {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    return {id: updatedUser.id, username: updatedUser.username};
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected != null && result.affected > 0;
  }
}