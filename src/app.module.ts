// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Core
import { TenantContextModule } from './modules/core/tenant-context/tenant-context.module';
import { TenantContextMiddleware } from './modules/core/tenant-context/tenant-context.middleware';

// Master
import { TenantsModule } from './modules/master/tenants/tenants.module';

// Tenant
import { ProductsModule } from './modules/tenant/products/products.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Conexión MASTER (schema: public)
        TypeOrmModule.forRoot({
            name: 'master',
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT ?? '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'multitenant_db',
            schema: 'public',
            entities: ['dist/modules/master/**/*.entity.js'],
            synchronize: true, // ⚠️ Solo para desarrollo
            logging: true,
        }),

        // Conexión TENANT (schema: dinámico)
        TypeOrmModule.forRoot({
            name: 'tenant',
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT ?? '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'multitenant_db',
            // El schema se establece dinámicamente por request
            entities: ['dist/modules/tenant/**/*.entity.js'],
            synchronize: true, // ⚠️ Solo para desarrollo
            logging: true,
        }),

        // Módulos
        TenantContextModule,
        TenantsModule,
        ProductsModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TenantContextMiddleware)
            // Excluir rutas master del middleware de tenant
            .exclude(
                { path: 'master/(.*)', method: RequestMethod.ALL },
                { path: 'health', method: RequestMethod.GET },
            )
            // Aplicar a todas las rutas de tenant
            .forRoutes('*');
    }
}