import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) return null;
        const isPasswordCorrect = await bcrypt.compare(pass, user.password);
        console.log("Comparing input (" + pass + ") with stored (" + user.password + ")...");
        if (isPasswordCorrect) {
            console.log("Compared successfully");
            const {password, ...result} = user;
            return result;
        }
        console.log("Compare failed");
        return null;
    }

    async login(user: any) {
        const payload = {username: user.username, sub: user.id};
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
