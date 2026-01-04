// src/modules/master/tenants/tenants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantOwner } from './entities/tenant-owner.entity';
import { TenantsService } from './services/tenants.service';
import { TenantsController } from './tenants.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, TenantOwner], 'master'),
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}