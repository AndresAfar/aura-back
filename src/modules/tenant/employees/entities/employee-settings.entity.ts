// src/modules/tenant/employees/entities/employee-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto',
}

export enum Language {
    ES = 'es',
    EN = 'en',
    PT = 'pt',
}

@Entity({ name: 'employee_settings' })
export class EmployeeSettings {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { unique: true })
    employee_id: string;

    @OneToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    // 🎨 Apariencia
    @Column({
        type: 'enum',
        enum: Theme,
        default: Theme.LIGHT,
    })
    theme: Theme;

    @Column({
        type: 'enum',
        enum: Language,
        default: Language.ES,
    })
    language: Language;

    @Column({ length: 7, default: '#3B82F6' })
    primary_color: string; // Color principal personalizado

    @Column({ default: 14 })
    font_size: number; // Tamaño de fuente (px)

    @Column({ default: true })
    compact_mode: boolean; // Modo compacto de interfaz

    // 🔔 Notificaciones
    @Column({ default: true })
    email_notifications: boolean;

    @Column({ default: true })
    sms_notifications: boolean;

    @Column({ default: true })
    push_notifications: boolean;

    @Column('jsonb', { nullable: true })
    notification_preferences: {
        new_sale?: boolean;
        low_stock?: boolean;
        new_order?: boolean;
        employee_messages?: boolean;
        daily_summary?: boolean;
    };

    // 🛒 POS / Punto de Venta
    @Column({ default: true })
    auto_print_receipt: boolean; // Imprimir ticket automáticamente

    @Column({ length: 50, nullable: true })
    default_printer: string; // Impresora predeterminada

    @Column({ default: false })
    sound_on_sale: boolean; // Sonido al completar venta

    @Column({ default: true })
    show_product_images: boolean; // Mostrar imágenes en POS

    @Column({ default: 10 })
    products_per_page: number; // Productos por página en catálogo

    @Column({ default: 'grid' })
    product_view_mode: string; // 'grid' o 'list'

    // 💰 Caja / Cash Register
    @Column({ length: 50, nullable: true })
    default_cash_register: string; // Caja asignada por defecto

    @Column({ default: false })
    require_cash_count: boolean; // Requiere conteo de caja al abrir/cerrar turno

    // 📊 Dashboard
    @Column('jsonb', { nullable: true })
    dashboard_widgets: string[]; // ['sales_today', 'top_products', 'low_stock']

    @Column({ default: 'week' })
    default_date_range: string; // 'today', 'week', 'month'

    @Column({ default: true })
    show_statistics: boolean;

    // 🔐 Seguridad
    @Column({ default: false })
    two_factor_enabled: boolean;

    @Column({ default: 30 })
    session_timeout_minutes: number;

    @Column({ default: false })
    require_password_on_actions: boolean; // Requiere contraseña para acciones sensibles

    // 🌐 Regional
    @Column({ length: 10, default: 'COP' })
    currency: string;

    @Column({ length: 50, default: 'America/Bogota' })
    timezone: string;

    @Column({ length: 20, default: 'DD/MM/YYYY' })
    date_format: string;

    @Column({ length: 20, default: 'HH:mm:ss' })
    time_format: string;

    // 📱 Accesos rápidos personalizados
    @Column('jsonb', { nullable: true })
    quick_actions: Array<{
        label: string;
        action: string;
        icon?: string;
    }>;

    // 🎯 Preferencias de trabajo
    @Column({ default: 'sales' })
    default_landing_page: string; // Página de inicio al hacer login

    @Column('simple-array', { nullable: true })
    favorite_reports: string[]; // Reportes favoritos

    @Column('jsonb', { nullable: true })
    keyboard_shortcuts: {
        new_sale?: string;
        search_product?: string;
        open_cash_register?: string;
        [key: string]: string | undefined;
    };

    // 📧 Firma de email
    @Column('text', { nullable: true })
    email_signature: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}