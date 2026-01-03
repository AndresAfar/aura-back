// src/modules/master/billing/entities/invoice.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum InvoiceStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity({ schema: 'public', name: 'invoices' })
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    tenant_id: string;

    @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
    tenant: Tenant;

    @Column({ unique: true })
    invoice_number: string; // INV-2025-001

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_amount: number;

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.PENDING,
    })
    @Index()
    status: InvoiceStatus;

    @Column({ type: 'date' })
    due_date: Date;

    @Column({ type: 'date', nullable: true })
    paid_at: Date;

    @Column({ nullable: true })
    stripe_invoice_id: string;

    @Column({ nullable: true })
    payment_method: string;

    @CreateDateColumn()
    created_at: Date;
}