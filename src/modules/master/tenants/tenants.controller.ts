// src/modules/master/tenants/tenants.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { TenantsService } from './services/tenants.service';
import { TenantType } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('master/tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Get()
    async findAll() {
        const tenants = await this.tenantsService.findAll();

        return {
            total: tenants.length,
            tenants: tenants.map(t => ({
                id: t.id,
                name: t.name,
                subdomain: t.subdomain,
                domain_complete: t.domain_complete,
                type: t.type,
                status: t.status,
                schema_name: t.schema_name,
                trial_ends_at: t.trial_ends_at,
                total_products: t.total_products,
                total_users: t.total_users,
                total_sales: t.total_sales,
                created_at: t.created_at,
            })),
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tenantsService.findById(id);
    }

    @Post()
    async create(@Body() createDto: CreateTenantDto) {
        const tenant = await this.tenantsService.create(createDto);

        return {
            message: '✅ Tenant creado exitosamente',
            tenant: {
                id: tenant.id,
                name: tenant.name,
                subdomain: tenant.subdomain,
                domain_complete: tenant.domain_complete,
                schema_name: tenant.schema_name,
                status: tenant.status,
                type: tenant.type,
                trial_ends_at: tenant.trial_ends_at,
            },
            instructions: {
                testing_methods: [
                    {
                        method: 'Header X-Tenant-ID',
                        example: `X-Tenant-ID: ${tenant.id}`,
                    },
                    {
                        method: 'Header X-Tenant-Subdomain',
                        example: `X-Tenant-Subdomain: ${tenant.subdomain}`,
                    },
                    {
                        method: 'Dominio completo',
                        example: `Host: ${tenant.domain_complete}`,
                    },
                ],
            },
        };
    }

    @Patch(':id/activate')
    async activate(@Param('id') id: string) {
        const tenant = await this.tenantsService.activate(id);
        return {
            message: 'Tenant activado',
            tenant,
        };
    }

    @Patch(':id/suspend')
    async suspend(@Param('id') id: string) {
        const tenant = await this.tenantsService.suspend(id);
        return {
            message: 'Tenant suspendido',
            tenant,
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.tenantsService.softDelete(id);
        return {
            message: 'Tenant eliminado (soft delete)',
        };
    }

    @Get(':id/limits')
    async checkLimits(@Param('id') id: string) {
        return this.tenantsService.checkLimits(id);
    }

    @Patch(':id/metrics/increment')
    async incrementMetric(
        @Param('id') id: string,
        @Body() body: { metric: 'products' | 'users' | 'sales' },
    ) {
        await this.tenantsService.incrementMetric(id, body.metric);
        return {
            message: `Métrica ${body.metric} incrementada`,
        };
    }
}