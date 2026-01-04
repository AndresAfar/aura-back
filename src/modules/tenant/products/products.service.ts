// src/modules/tenant/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product, 'tenant')
        private productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            where: { deleted_at: IsNull() },
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id, deleted_at: IsNull() },
        });

        if (!product) {
            throw new NotFoundException(`Product con ID "${id}" no encontrado`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);

        Object.assign(product, updateProductDto);

        return await this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);

        product.deleted_at = new Date();
        await this.productRepository.save(product);
    }

    async findByBarcode(barcode: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { barcode, deleted_at: IsNull() },
        });

        if (!product) {
            throw new NotFoundException(`Product con barcode "${barcode}" no encontrado`);
        }

        return product;
    }

    async findBySku(sku: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { sku, deleted_at: IsNull() },
        });

        if (!product) {
            throw new NotFoundException(`Product con SKU "${sku}" no encontrado`);
        }

        return product;
    }

    async getLowStock(): Promise<Product[]> {
        return this.productRepository
            .createQueryBuilder('product')
            .where('product.stock_quantity <= product.min_stock')
            .andWhere('product.deleted_at IS NULL')
            .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
            .getMany();
    }

    async updateStock(id: string, quantity: number): Promise<Product> {
        const product = await this.findOne(id);

        product.stock_quantity += quantity;

        if (product.stock_quantity <= 0) {
            product.status = ProductStatus.OUT_OF_STOCK;
        } else if (product.status === ProductStatus.OUT_OF_STOCK) {
            product.status = ProductStatus.ACTIVE;
        }

        return await this.productRepository.save(product);
    }
}