// src/modules/core/tenant-context/tenant-context.module.ts
import { Module, Global } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantContextMiddleware } from './tenant-context.middleware';
import { TenantContextInterceptor } from './tenant-context.interceptor';
import { TenantsModule } from '../../master/tenants/tenants.module';

@Global()
@Module({
  imports: [TenantsModule],
  providers: [
    TenantContextService,
    TenantContextMiddleware,
    TenantContextInterceptor,
  ],
  exports: [
    TenantContextService,
    TenantContextMiddleware,
    TenantContextInterceptor,
  ],
})
export class TenantContextModule {}