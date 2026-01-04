// src/modules/core/guards/tenant-access.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TenantStatus } from '../../master/tenants/entities/tenant.entity';

@Injectable()
export class TenantAccessGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const tenant = request.tenant;

        if (!tenant) {
            throw new ForbiddenException('No se ha establecido el contexto del tenant');
        }

        if (tenant.status === TenantStatus.SUSPENDED) {
            throw new ForbiddenException('Esta tienda está suspendida temporalmente');
        }

        if (tenant.status === TenantStatus.CANCELLED) {
            throw new ForbiddenException('Esta tienda ha sido cancelada');
        }

        console.log(`✅ Guard aprobado para tenant: ${tenant.name}`);

        return true;
    }
}