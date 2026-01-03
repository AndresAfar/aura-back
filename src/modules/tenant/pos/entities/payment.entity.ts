// src/modules/tenant/pos/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Sale } from './sale.entity';

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    TRANSFER = 'transfer',
    DIGITAL_WALLET = 'digital_wallet',
}

export enum PaymentStatus {
    COMPLETED = 'completed',
    PENDING = 'pending',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    sale_id: string;

    @ManyToOne(() => Sale, (sale) => sale.payments, { onDelete: 'CASCADE' })
    sale: Sale;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
    })
    method: PaymentMethod;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.COMPLETED,
    })
    status: PaymentStatus;

    @Column({ nullable: true })
    reference: string; // Número de transacción, últimos 4 dígitos de tarjeta

    @CreateDateColumn()
    created_at: Date;
}