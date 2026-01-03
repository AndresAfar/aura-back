// src/modules/tenant/products/entities/product-variant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_variants' })
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    product_id: string;

    @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
    product: Product;

    @Column({ unique: true, length: 50 })
    @Index()
    sku: string;

    @Column({ length: 100, nullable: true })
    barcode: string;

    @Column({ length: 50, nullable: true })
    size: string; // S, M, L, XL

    @Column({ length: 50, nullable: true })
    color: string; // Rojo, Azul, Negro

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int', { default: 0 })
    stock_quantity: number;

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    is_active: boolean;
}