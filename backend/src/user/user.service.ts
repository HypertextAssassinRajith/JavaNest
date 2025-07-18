import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}
    
    async createUser(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new ConflictException('User already exists');
        }
        return this.prisma.user.create({
          data: { email, password: hashedPassword },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(email: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
          throw new NotFoundException('User not found');
        }
        return this.prisma.user.findUnique({where : { email : email}})
    }

    async update(email: string, data: { email?: string; password?: string }) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
          throw new NotFoundException('User not found');
        }
        if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
          where: { email:email },
          data,
        });
      }

      async delete(email: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
          throw new NotFoundException('User not found');
        }
        return this.prisma.user.delete({where:{ email:email }})
    }
}
