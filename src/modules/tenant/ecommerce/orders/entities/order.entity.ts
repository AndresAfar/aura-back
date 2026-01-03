// src/modules/tenant/ecommerce/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Customer } from '../../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'pending',           // Pendiente de pago
    CONFIRMED = 'confirmed',       // Confirmado y pagado
    PROCESSING = 'processing',     // En preparación
    SHIPPED = 'shipped',           // Enviado
    DELIVERED = 'delivered',       // Entregado
    CANCELLED = 'cancelled',       // Cancelado
    REFUNDED = 'refunded',        // Reembolsado
}

@Entity({ name: 'orders' })
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    order_number: string; // ORD-2025-001

    @Column('uuid')
    @Index()
    customer_id: string;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer: Customer;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    // Dirección de envío
    @Column('jsonb')
    shipping_address: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };

    // Montos
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    shipping_cost: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    // Envío
    @Column({ nullable: true })
    shipping_method: string; // standard, express, pickup

    @Column({ nullable: true })
    tracking_number: string;

    @Column({ nullable: true })
    carrier: string; // FedEx, UPS, DHL, etc.

    // Estado
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    @Index()
    status: OrderStatus;

    // Fechas
    @Column({ type: 'timestamp', nullable: true })
    confirmed_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    shipped_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    delivered_at: Date;

    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}