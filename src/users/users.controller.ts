import { Body, Controller, Get, Post, Put, Delete, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Users> {
    return this.usersService.findOne(id);
  }

  @Get('/username/:username')
  async findOneByUsername(@Param('username') username: string): Promise<Users> {
    return this.usersService.findOneByUsername(username);
  }

  @Get()
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201) 
  async create(@Body() user: Users): Promise<Users> {
    const createdUser = await this.usersService.create(user);
    return createdUser;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: Users): Promise<any> {
    await this.usersService.update(id, user);
    return { message: 'User updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
