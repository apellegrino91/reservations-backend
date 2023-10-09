import { Body, Controller, Get, Post, Put, Delete, HttpCode, NotFoundException, Param, UseGuards, Response, Res, HttpStatus, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse, Users } from './users.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<UserResponse> {
    const user = await this.usersService.findOne(id);
    if (user == null) {
      throw new NotFoundException("User not found.");
    }
    return user;
  }

  @Get('/username/:username')
  async findOneByUsername(@Param('username') username: string): Promise<any> {
    console.log("Finding user with username " + username);
    const user = await this.usersService.findOneByUsername(username);
    if (user == null) {
      console.log("User not found!");
      throw new NotFoundException("User not found.");
    }
    console.log("User found!");
    return {id: user.id, username: user.username}
  };

  @Get()
  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersService.findAll();
    if (users == null) {
      throw new NotFoundException("Users not found");
    }
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201) 
  async create(@Body() user: Users): Promise<UserResponse> {
    try {
      const potentialExistingUser = await this.usersService.findOneByUsername(user.username);
      if (potentialExistingUser) {
        throw new ConflictException("User already exists.");
      } else {
        const createdUser = await this.usersService.create(user);
        return createdUser; 
      }
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: Users): Promise<any> {
    const updatedUser = await this.usersService.update(id, user);
    if (updatedUser == null) {
      throw new NotFoundException("User not updated.");
    }
    return { message: 'User updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    const result = await this.usersService.delete(id);
    if (!result) {
      throw new BadRequestException("User not deleted.");
    }
    return { message: 'User deleted successfully' };
  }
}
