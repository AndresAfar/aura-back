// src/modules/core/tenant-context/tenant-context.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
    constructor(
        @InjectDataSource('tenant')
        private readonly dataSource: DataSource,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const tenant = request.tenant;

        if (!tenant) {
            throw new BadRequestException('No se ha establecido el contexto del tenant');
        }

        const schemaName = tenant.schema_name;

        if (!schemaName) {
            throw new BadRequestException('El tenant no tiene un schema_name válido');
        }

        // Cambiar el search_path de PostgreSQL
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.query(`SET search_path TO ${schemaName}, public`);
            console.log(`✅ Schema establecido: ${schemaName}`);

            // Ejecutar el handler y liberar la conexión al finalizar
            return next.handle();
        } catch (error) {
            console.error('❌ Error en TenantContextInterceptor:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}