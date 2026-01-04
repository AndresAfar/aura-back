// src/modules/core/tenant-context/tenant-context.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Tenant } from '../../master/tenants/entities/tenant.entity';

export interface TenantContext {
    tenant: Tenant;
    tenantId: string;
    schemaName: string;
}

@Injectable({ scope: Scope.DEFAULT })
export class TenantContextService {
    private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

    setTenant(tenant: Tenant): void {
        const context: TenantContext = {
            tenant,
            tenantId: tenant.id,
            schemaName: tenant.schema_name,
        };
        this.asyncLocalStorage.enterWith(context);
    }

    getTenant(): Tenant | undefined {
        return this.asyncLocalStorage.getStore()?.tenant;
    }

    getTenantId(): string | undefined {
        return this.asyncLocalStorage.getStore()?.tenantId;
    }

    getSchemaName(): string | undefined {
        return this.asyncLocalStorage.getStore()?.schemaName;
    }

    getContext(): TenantContext | undefined {
        return this.asyncLocalStorage.getStore();
    }

    hasTenant(): boolean {
        return !!this.asyncLocalStorage.getStore();
    }
}