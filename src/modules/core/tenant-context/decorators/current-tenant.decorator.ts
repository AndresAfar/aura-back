// src/modules/core/tenant-context/decorators/current-tenant.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Tenant } from '../../../master/tenants/entities/tenant.entity';

export const CurrentTenant = createParamDecorator(
    (data: keyof Tenant | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const tenant = request.tenant;

        if (!tenant) {
            return null;
        }

        // Si se especifica un campo, retornar solo ese campo
        return data ? tenant[data] : tenant;
    },
);