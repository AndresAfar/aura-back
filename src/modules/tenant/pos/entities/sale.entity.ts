// src/modules/tenant/pos/entities/sale.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { SaleItem } from './sale-item.entity';
import { Payment } from './payment.entity';

export enum SaleStatus {
    COMPLETED = 'completed',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

export enum SaleType {
    POS = 'pos',           // Venta en tienda física
    ONLINE = 'online',     // Venta online
    PHONE = 'phone',       // Venta telefónica
    WHOLESALE = 'wholesale', // Venta mayorista
}

@Entity({ name: 'sales' })
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    sale_number: string; // SALE-2025-001

    // Empleado que registró la venta (cajero/vendedor)
    @Column('uuid')
    @Index()
    employee_id: string;

    @ManyToOne(() => Employee)
    employee: Employee;

    // Cliente que compró (OPCIONAL - puede ser venta anónima)
    @Column('uuid', { nullable: true })
    @Index()
    customer_id: string;

    @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true })
    customer: Customer;

    // Tipo de venta
    @Column({
        type: 'enum',
        enum: SaleType,
        default: SaleType.POS,
    })
    type: SaleType;

    // Items y pagos
    @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
    items: SaleItem[];

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

    // Puntos de fidelidad otorgados
    @Column('int', { default: 0 })
    loyalty_points_earned: number;

    @Column('int', { default: 0 })
    loyalty_points_redeemed: number;

    // Estado
    @Column({
        type: 'enum',
        enum: SaleStatus,
        default: SaleStatus.COMPLETED,
    })
    @Index()
    status: SaleStatus;

    @Column('text', { nullable: true })
    notes: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    cancelled_at: Date;
}