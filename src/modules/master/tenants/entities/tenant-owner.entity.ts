// src/modules/master/tenants/entities/tenant-owner.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Tenant } from './tenant.entity';

export enum OwnerRole {
    OWNER = 'owner',
    ADMIN = 'admin',
}

@Entity({ schema: 'public', name: 'tenant_owners' })
export class TenantOwner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    tenant_id: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.owners, { onDelete: 'CASCADE' })
    tenant: Tenant;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, length: 255 })
    @Index()
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: OwnerRole,
        default: OwnerRole.OWNER,
    })
    role: OwnerRole;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'timestamp', nullable: true })
    last_login_at: Date;

    @CreateDateColumn()
    created_at: Date;
}