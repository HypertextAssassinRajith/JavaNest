import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @Post()
  async createOrder(
    @Body('items') items: Array<{ productId: number; qty: number }>,
    @Body('customer') customer: { name: string; contact: string; address: string; note?: string },
    @Body('userId') userId?: number,
  ) {
    return this.ordersService.createFromFrontend({ items, customer, userId });
  }

  @Post('checkout/:userId')
  async checkout(@Param('userId', ParseIntPipe) userId: number, @Body('cartItems') cartItems: any[]) {
    return this.ordersService.checkout(userId, cartItems);
  }

  @Get('user/:email')
  async getOrdersByUser(@Param('email') email: string) {
    return this.ordersService.getOrdersByUser(email);
  }

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  async updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Delete(':id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.deleteOrder(id);
  }
}
