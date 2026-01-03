// src/modules/tenant/employees/entities/employee.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToOne } from 'typeorm';
import { EmployeeSettings } from './employee-settings.entity';

export enum EmployeeRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    CASHIER = 'cashier',
    WAREHOUSE = 'warehouse',
    SALES = 'sales',
}

@Entity({ name: 'employees' })
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255, unique: true })
    @Index()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({
        type: 'enum',
        enum: EmployeeRole,
        default: EmployeeRole.CASHIER,
    })
    @Index()
    role: EmployeeRole;

    // ✨ RELACIÓN CON SETTINGS
    @OneToOne(() => EmployeeSettings, (settings) => settings.employee, { eager: true })
    settings: EmployeeSettings;

    @Column('jsonb', { nullable: true })
    permissions: string[];

    @Column({ length: 50, nullable: true })
    employee_code: string;

    @Column({ type: 'date', nullable: true })
    hire_date: Date;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    salary: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    commission_rate: number;

    @Column('jsonb', { nullable: true })
    schedule: {
        monday?: { start: string; end: string };
        tuesday?: { start: string; end: string };
        wednesday?: { start: string; end: string };
        thursday?: { start: string; end: string };
        friday?: { start: string; end: string };
        saturday?: { start: string; end: string };
        sunday?: { start: string; end: string };
    };

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'timestamp', nullable: true })
    last_login_at: Date;

    @Column('jsonb', { nullable: true })
    metadata: {
        photo?: string;
        address?: string;
        emergency_contact?: string;
        emergency_phone?: string;
        notes?: string;
    };

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}