// src/modules/master/tenants/entities/tenant.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Plan } from '../../plans/entities/plan.entity';
import { Subscription } from '../../plans/entities/subscription.entity';
import { TenantOwner } from './tenant-owner.entity';

export enum TenantStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    CANCELLED = 'cancelled',
    TRIAL = 'trial',
}

export enum TenantType {
    SUPERMARKET = 'supermarket',
    CLOTHING = 'clothing',
    SKATESHOP = 'skateshop',
    FRUITSHOP = 'fruitshop',
    GENERAL = 'general',
}

@Entity({ schema: 'public', name: 'tenants' })
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 100 })
    @Index()
    name: string; // Nombre de la tienda: "Mi Supermercado"

    @Column({ unique: true, length: 50 })
    @Index()
    subdomain: string; // misupermercado

    @Column({ unique: true, length: 50 })
    schema_name: string; // tenant_uuid

    @Column({
        type: 'enum',
        enum: TenantType,
        default: TenantType.GENERAL,
    })
    type: TenantType;

    @Column({
        type: 'enum',
        enum: TenantStatus,
        default: TenantStatus.TRIAL,
    })
    @Index()
    status: TenantStatus;

    // Relación con el plan
    @Column('uuid', { nullable: true })
    plan_id: string;

    @ManyToOne(() => Plan, { eager: true })
    plan: Plan;

    // Relación con suscripción activa
    @OneToMany(() => Subscription, (subscription) => subscription.tenant)
    subscriptions: Subscription[];

    // Propietarios de la tienda
    @OneToMany(() => TenantOwner, (owner) => owner.tenant)
    owners: TenantOwner[];

    // Configuración JSON
    @Column('jsonb', { nullable: true })
    config: {
        logo?: string;
        primary_color?: string;
        secondary_color?: string;
        currency?: string;
        timezone?: string;
        language?: string;
        contact_email?: string;
        contact_phone?: string;
        address?: string;
        tax_id?: string;
    };

    // Límites del plan
    @Column('jsonb', { nullable: true })
    limits: {
        max_products?: number;
        max_users?: number;
        max_storage_mb?: number;
        max_transactions_monthly?: number;
    };

    // Métricas
    @Column({ type: 'int', default: 0 })
    total_products: number;

    @Column({ type: 'int', default: 0 })
    total_users: number;

    @Column({ type: 'int', default: 0 })
    total_sales: number;

    // Trial
    @Column({ type: 'date', nullable: true })
    trial_ends_at: Date;

    // Fechas
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}