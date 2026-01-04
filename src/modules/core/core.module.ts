// src/modules/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TenantContextModule } from './tenant-context/tenant-context.module';
import { TenantAccessGuard } from './guards/tenant-access.guard';

@Global()
@Module({
    imports: [TenantContextModule],
    providers: [TenantAccessGuard],
    exports: [TenantContextModule, TenantAccessGuard],
})
export class CoreModule { }