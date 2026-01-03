// src/modules/tenant/pos/entities/sale-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity({ name: 'sale_items' })
export class SaleItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    sale_id: string;

    @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
    sale: Sale;

    @Column('uuid')
    product_id: string;

    @ManyToOne(() => Product)
    product: Product;

    @Column('uuid', { nullable: true })
    variant_id: string;

    @ManyToOne(() => ProductVariant, { nullable: true })
    variant: ProductVariant;

    // Datos en el momento de la venta
    @Column({ length: 255 })
    product_name: string;

    @Column({ length: 50, nullable: true })
    product_sku: string;

    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    tax_rate: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number; // quantity * unit_price

    @Column('decimal', { precision: 10, scale: 2 })
    total: number; // subtotal + tax - discount
}