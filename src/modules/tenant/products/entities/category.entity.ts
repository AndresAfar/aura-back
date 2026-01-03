// src/modules/tenant/products/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, length: 100 })
    @Index()
    slug: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ nullable: true })
    image: string;

    // Categoría padre (para subcategorías)
    @Column('uuid', { nullable: true })
    parent_id: string;

    @ManyToOne(() => Category, { nullable: true })
    parent: Category;

    @Column({ default: 0 })
    sort_order: number;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}