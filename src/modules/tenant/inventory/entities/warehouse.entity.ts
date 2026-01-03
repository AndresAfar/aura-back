// src/modules/tenant/inventory/entities/warehouse.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'warehouses' })
export class Warehouse {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column('text', { nullable: true })
    address: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    is_main: boolean; // Almacén principal

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}