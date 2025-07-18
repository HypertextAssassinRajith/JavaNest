import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Table } from '@prisma/client';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async createTable(data: { number: number; capacity: number }): Promise<Table> {
    const existingTable = await this.prisma.table.findUnique({ where: { number: data.number } });
    if (existingTable) {
      throw new ConflictException('Table already exists');
    }
    return this.prisma.table.create({ data });
  }


  async getAllTables(): Promise<Table[]> {
    return this.prisma.table.findMany();
  }


  async getTableById(id: number): Promise<Table | null> {
    const existingTable = await this.prisma.table.findUnique({ where: { id } });
    if (!existingTable) {
      throw new NotFoundException('Table not found');
    }
    return existingTable;
  }

  async updateTable(id: number, data: { capacity?: number }): Promise<Table> {
    const existingTable = await this.prisma.table.findUnique({ where: { id } });
    if (!existingTable) {
      throw new NotFoundException('Table not found');
    }
    return this.prisma.table.update({ where: { id }, data });
  }


  async deleteTable(id: number): Promise<Table> {
    const existingTable = await this.prisma.table.findUnique({ where: { id } });
    if (!existingTable) {
      throw new NotFoundException('Table not found');
    }
    return this.prisma.table.delete({ where: { id } });
  }
}
