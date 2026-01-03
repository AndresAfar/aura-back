// src/modules/tenant/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    CASHIER = 'cashier',
    WAREHOUSE = 'warehouse',
    CUSTOMER = 'customer',
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255 })
    @Index()
    email: string;

    @Column({ select: false, nullable: true })
    password: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CASHIER,
    })
    @Index()
    role: UserRole;

    @Column({ default: true })
    is_active: boolean;

    @Column('jsonb', { nullable: true })
    permissions: string[]; // ['create_products', 'view_reports', etc]

    @Column({ type: 'timestamp', nullable: true })
    last_login_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}