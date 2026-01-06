import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, items: any[], totalAmount: number): Promise<any> {
    return this.prisma.order.create({
      data: {
        userId,
        items,
        totalAmount,
        status: 'pending',
      },
    });
  }

  // New frontend-compatible order creator.
  // Stores customer details in the JSON `items` field under `customer` for now.
  // (If you want, we can migrate Prisma schema later to add dedicated columns.)
  async createFromFrontend(payload: {
    items: Array<{ productId: number; qty: number }>;
    customer: { name: string; contact: string; address: string; note?: string };
    userId?: number;
  }) {
    const { items, customer } = payload;

    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('items is required');
    }
    if (!customer?.name || !customer?.contact || !customer?.address) {
      throw new BadRequestException('customer.name, customer.contact and customer.address are required');
    }

    // Guest checkout fallback: attach to user 1 if not provided.
    // Change this logic based on your auth requirements.
    const userId = payload.userId ?? 1;

    const ids = items.map((i) => Number(i.productId)).filter((n) => Number.isFinite(n));
    const products = (await this.prisma.product.findMany({ where: { id: { in: ids } } })) as any[];
    const byId = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const normalized = items.map((it) => {
      const productId = Number(it.productId);
      const qty = Math.max(1, Number(it.qty) || 1);
      const p: any = byId.get(productId);
      if (!p) throw new BadRequestException(`Invalid productId ${productId}`);

      const price = Number(p.price ?? '0');
      if (!Number.isFinite(price)) throw new BadRequestException(`Invalid price for productId ${productId}`);

      totalAmount += price * qty;
      return {
        productId,
        qty,
        name: p.name,
        unitPrice: price,
        imageUrl: p.imageUrl,
      };
    });

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'pending',
        items: {
          customer,
          items: normalized,
        } as any,
      },
    });
  }

  async getOrdersByUser(email: string): Promise<any[]> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    const userId = user?.id;

    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: number): Promise<any | null> {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async updateOrderStatus(id: number, status: string): Promise<any> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async deleteOrder(id: number): Promise<any> {
    return this.prisma.order.delete({ where: { id } });
  }

  async checkout(userId: number, cartItems: any[]): Promise<any> {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return this.createOrder(userId, cartItems, totalAmount);
  }
}

