// src/modules/tenant/customers/entities/customer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Sale } from '../../pos/entities/sale.entity';
import { Order } from '../../ecommerce/orders/entities/order.entity';

export enum CustomerType {
  RETAIL = 'retail',         // Cliente minorista (persona natural)
  WHOLESALE = 'wholesale',   // Cliente mayorista
  VIP = 'vip',              // Cliente VIP
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Datos básicos
  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, nullable: true })
  @Index()
  email: string;

  @Column({ select: false, nullable: true })
  password: string; // Solo si tiene cuenta en e-commerce

  @Column({ length: 20, nullable: true })
  @Index()
  phone: string;

  @Column({ unique: true, length: 50, nullable: true })
  @Index()
  customer_code: string; // C-001, C-002 (autogenerado)

  // Tipo de cliente
  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.RETAIL,
  })
  type: CustomerType;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  @Index()
  status: CustomerStatus;

  // Datos fiscales (para mayoristas o facturas)
  @Column({ length: 50, nullable: true })
  tax_id: string; // NIT, RUT, RFC, etc.

  @Column({ length: 255, nullable: true })
  company_name: string; // Si es empresa

  // Dirección principal
  @Column('text', { nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 20, nullable: true })
  postal_code: string;

  @Column({ length: 50, nullable: true })
  country: string;

  // Direcciones adicionales (para e-commerce)
  @Column('jsonb', { nullable: true })
  shipping_addresses: Array<{
    label: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
  }>;

  // Programa de fidelidad
  @Column('int', { default: 0 })
  loyalty_points: number;

  @Column({ length: 20, nullable: true })
  loyalty_tier: string; // bronze, silver, gold, platinum

  // Límite de crédito (para mayoristas)
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  credit_limit: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  current_balance: number; // Deuda actual

  // Estadísticas
  @Column('int', { default: 0 })
  total_purchases: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_spent: number;

  @Column({ type: 'date', nullable: true })
  last_purchase_at: Date;

  // Relaciones
  @OneToMany(() => Sale, (sale) => sale.customer)
  sales: Sale[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  // Preferencias
  @Column('jsonb', { nullable: true })
  preferences: {
    newsletter?: boolean;
    sms_marketing?: boolean;
    preferred_payment_method?: string;
    notes?: string;
  };

  // Cuenta de e-commerce
  @Column({ default: false })
  has_online_account: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  // Fechas importantes
  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}