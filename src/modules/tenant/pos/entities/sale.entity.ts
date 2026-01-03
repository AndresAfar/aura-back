// src/modules/tenant/pos/entities/sale.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SaleItem } from './sale-item.entity';
import { Payment } from './payment.entity';

export enum SaleStatus {
    COMPLETED = 'completed',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

@Entity({ name: 'sales' })
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    sale_number: string; // SALE-2025-001

    @Column('uuid')
    @Index()
    cashier_id: string;

    @ManyToOne(() => User)
    cashier: User;

    @Column('uuid', { nullable: true })
    customer_id: string;

    @ManyToOne(() => User, { nullable: true })
    customer: User;

    // Items de la venta
    @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
    items: SaleItem[];

    // Pagos
    @OneToMany(() => Payment, (payment) => payment.sale, { cascade: true })
    payments: Payment[];

    // Montos
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    // Estado
    @Column({
        type: 'enum',
        enum: SaleStatus,
        default: SaleStatus.COMPLETED,
    })
    @Index()
    status: SaleStatus;

    // Notas
    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    cancelled_at: Date;
}