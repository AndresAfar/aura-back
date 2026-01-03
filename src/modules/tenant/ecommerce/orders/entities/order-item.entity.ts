// src/modules/tenant/ecommerce/orders/entities/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../../products/entities/product.entity';
import { ProductVariant } from '../../../products/entities/product-variant.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    order_id: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @Column('uuid')
    @Index()
    product_id: string;

    @ManyToOne(() => Product)
    product: Product;

    @Column('uuid', { nullable: true })
    variant_id: string;

    @ManyToOne(() => ProductVariant, { nullable: true })
    variant: ProductVariant;

    // Snapshot de datos del producto en el momento del pedido
    // (importante porque precios/nombres pueden cambiar)
    @Column({ length: 255 })
    product_name: string;

    @Column({ length: 50, nullable: true })
    product_sku: string;

    @Column({ length: 50, nullable: true })
    variant_name: string; // "Talla: M, Color: Rojo"

    @Column({ nullable: true })
    product_image: string; // URL de la imagen principal

    // Precios
    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    tax_rate: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number; // Descuento por producto

    // Cálculos
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number; // quantity * unit_price

    @Column('decimal', { precision: 10, scale: 2 })
    tax_amount: number; // subtotal * tax_rate / 100

    @Column('decimal', { precision: 10, scale: 2 })
    total: number; // subtotal + tax_amount - discount_amount

    // Metadata adicional (útil para análisis)
    @Column('jsonb', { nullable: true })
    metadata: {
        category?: string;
        brand?: string;
        weight?: number;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
    };
}