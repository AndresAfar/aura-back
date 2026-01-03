// src/modules/tenant/products/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    OUT_OF_STOCK = 'out_of_stock',
}

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    @Index()
    sku: string;

    @Column({ unique: true, length: 100 })
    @Index()
    barcode: string;

    @Column({ length: 255 })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('uuid', { nullable: true })
    category_id: string;

    @ManyToOne(() => Category, { nullable: true })
    category: Category;

    // Precios
    @Column('decimal', { precision: 10, scale: 2 })
    cost_price: number; // Precio de costo

    @Column('decimal', { precision: 10, scale: 2 })
    sale_price: number; // Precio de venta

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    tax_rate: number; // Porcentaje de impuesto (ej: 19.00 para 19%)

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    discount_price: number; // Precio con descuento

    // Inventario
    @Column('int', { default: 0 })
    stock_quantity: number;

    @Column('int', { default: 0 })
    min_stock: number; // Alerta de stock mínimo

    @Column('int', { nullable: true })
    max_stock: number;

    // Medidas
    @Column({ length: 20, nullable: true })
    unit: string; // kg, unidad, litro, etc

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    weight: number;

    // Imágenes
    @Column('simple-array', { nullable: true })
    images: string[];

    // Variantes (tallas, colores, etc)
    @OneToMany(() => ProductVariant, (variant) => variant.product)
    variants: ProductVariant[];

    // Estado
    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.ACTIVE,
    })
    @Index()
    status: ProductStatus;

    // E-commerce
    @Column({ default: false })
    is_published: boolean; // Visible en tienda online

    @Column({ default: false })
    is_featured: boolean; // Producto destacado

    // Metadata
    @Column('jsonb', { nullable: true })
    metadata: {
        brand?: string;
        model?: string;
        season?: string;
        tags?: string[];
    };

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}