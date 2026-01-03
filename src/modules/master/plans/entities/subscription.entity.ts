// src/modules/master/plans/entities/subscription.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Plan } from './plan.entity';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAST_DUE = 'past_due',
    CANCELLED = 'cancelled',
    TRIAL = 'trial',
}

export enum BillingInterval {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

@Entity({ schema: 'public', name: 'subscriptions' })
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    tenant_id: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.subscriptions, { onDelete: 'CASCADE' })
    tenant: Tenant;

    @Column('uuid')
    plan_id: string;

    @ManyToOne(() => Plan, { eager: true })
    plan: Plan;

    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.TRIAL,
    })
    @Index()
    status: SubscriptionStatus;

    @Column({
        type: 'enum',
        enum: BillingInterval,
        default: BillingInterval.MONTHLY,
    })
    billing_interval: BillingInterval;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    current_period_start: Date;

    @Column({ type: 'date' })
    current_period_end: Date;

    @Column({ type: 'date', nullable: true })
    trial_ends_at: Date;

    @Column({ type: 'date', nullable: true })
    cancelled_at: Date;

    // Integración con pasarela de pago
    @Column({ nullable: true })
    stripe_subscription_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}