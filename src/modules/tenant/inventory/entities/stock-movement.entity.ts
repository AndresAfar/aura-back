// src/modules/tenant/inventory/entities/stock-movement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Warehouse } from './warehouse.entity';

export enum MovementType {
    PURCHASE = 'purchase',      // Compra a proveedor
    SALE = 'sale',              // Venta
    ADJUSTMENT = 'adjustment',  // Ajuste de inventario
    RETURN = 'return',          // Devolución
    TRANSFER = 'transfer',      // Transferencia entre almacenes
    DAMAGE = 'damage',          // Producto dañado
}

@Entity({ name: 'stock_movements' })
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    product_id: string;

    @ManyToOne(() => Product)
    product: Product;

    @Column('uuid', { nullable: true })
    variant_id: string;

    @ManyToOne(() => ProductVariant, { nullable: true })
    variant: ProductVariant;

    @Column('uuid', { nullable: true })
    warehouse_id: string;

    @ManyToOne(() => Warehouse, { nullable: true })
    warehouse: Warehouse;

    @Column({
        type: 'enum',
        enum: MovementType,
    })
    @Index()
    type: MovementType;

    @Column('int')
    quantity: number; // Positivo para entradas, negativo para salidas

    @Column('int')
    stock_before: number;

    @Column('int')
    stock_after: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    unit_cost: number; // Costo unitario en compras

    @Column('uuid', { nullable: true })
    user_id: string;

    @ManyToOne(() => Employee, { nullable: true })
    user: Employee;

    @Column('text', { nullable: true })
    notes: string;

    // Referencia a venta o compra
    @Column('uuid', { nullable: true })
    reference_id: string;

    @Column({ length: 50, nullable: true })
    reference_type: string; // 'sale', 'purchase', etc

    @CreateDateColumn()
    created_at: Date;
}