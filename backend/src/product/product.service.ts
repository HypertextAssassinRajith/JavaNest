import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  async create(data: any, file?: Express.Multer.File) {
    let imageUrl = data.imageUrl;
    if (file) {
      imageUrl = await this.s3Service.uploadFile(file);
    }

    const discountValue = data.discountActive ? data.discountValue : null;

    return this.prisma.product.create({
      data: {
        ...data,
        id: undefined,
        imageUrl,
        discountValue,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, data: any, file?: Express.Multer.File) {

    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    let imageUrl = data.imageUrl;
    if (file) {
      imageUrl = await this.s3Service.uploadFile(file);
    }

    const discountValue = data.discountActive ? data.discountValue : null;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        imageUrl,
        discountValue,
      },
    });
  }

  async remove(id: number) {

    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.prisma.product.delete({ where: { id } });
  }
}
