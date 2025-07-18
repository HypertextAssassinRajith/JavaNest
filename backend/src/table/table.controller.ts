import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TableService } from './table.service';

@Controller('tables')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  async createTable(@Body() data: { number: number; capacity: number }) {
    return this.tableService.createTable(data);
  }

  @Get()
  async getAllTables() {
    return this.tableService.getAllTables();
  }

  @Get(':id')
  async getTable(@Param('id',ParseIntPipe) id: number) {
    return this.tableService.getTableById(id);
  }

  @Patch(':id')
  async updateTable(@Param('id',ParseIntPipe) id: number, @Body() data: { capacity?: number }) {
    return this.tableService.updateTable(id, data);
  }

  @Delete(':id')
  async deleteTable(@Param('id',ParseIntPipe) id: number) {
    return this.tableService.deleteTable(id);
  }
}
