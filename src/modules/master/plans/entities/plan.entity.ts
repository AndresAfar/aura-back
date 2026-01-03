// src/modules/master/plans/entities/plan.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'plans' })
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    name: string; // basic, pro, enterprise

    @Column({ length: 255, nullable: true })
    display_name: string; // "Plan Básico", "Plan Pro"

    @Column('text', { nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price_monthly: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    price_yearly: number;

    @Column({ default: 14 })
    trial_days: number;

    // Límites del plan
    @Column('jsonb')
    features: {
        max_products: number;
        max_users: number;
        max_storage_mb: number;
        max_transactions_monthly: number;
        has_ecommerce: boolean;
        has_api_access: boolean;
        has_multi_warehouse: boolean;
        has_reports: boolean;
        has_custom_domain: boolean;
    };

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: 0 })
    sort_order: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}