// src/modules/core/tenant-context/tenant-context.middleware.ts
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextService } from './tenant-context.service';
import { TenantsService } from '../../master/tenants/services/tenants.service';
import { Tenant } from '../../master/tenants/entities/tenant.entity';

// Extender el tipo Request para incluir tenant
declare global {
    namespace Express {
        interface Request {
            tenant?: Tenant;
        }
    }
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
    constructor(
        private readonly tenantContextService: TenantContextService,
        private readonly tenantsService: TenantsService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            let tenant;

            // Opción 1: Por header X-Tenant-ID
            const tenantIdHeader = req.headers['x-tenant-id'] as string;

            // Opción 2: Por header X-Tenant-Subdomain
            const subdomainHeader = req.headers['x-tenant-subdomain'] as string;

            // Opción 3: Por subdomain en el hostname
            const subdomain = this.extractSubdomain(req.hostname);

            // Opción 4: Por dominio completo
            const fullDomain = req.hostname;

            if (tenantIdHeader) {
                console.log(`🔍 Buscando tenant por ID: ${tenantIdHeader}`);
                tenant = await this.tenantsService.findById(tenantIdHeader);
            } else if (subdomainHeader) {
                console.log(`🔍 Buscando tenant por subdomain header: ${subdomainHeader}`);
                tenant = await this.tenantsService.findBySubdomain(subdomainHeader);
            } else if (fullDomain.includes('.auraapp.io')) {
                console.log(`🔍 Buscando tenant por dominio completo: ${fullDomain}`);
                tenant = await this.tenantsService.findByDomainComplete(fullDomain);
            } else if (subdomain) {
                console.log(`🔍 Buscando tenant por subdomain: ${subdomain}`);
                tenant = await this.tenantsService.findBySubdomain(subdomain);
            } else {
                throw new BadRequestException(
                    'No se pudo identificar el tenant. Usa uno de estos métodos:\n' +
                    '1. Header X-Tenant-ID: <uuid>\n' +
                    '2. Header X-Tenant-Subdomain: <subdomain>\n' +
                    '3. Subdomain: <subdomain>.auraapp.io',
                );
            }

            console.log(`✅ Tenant encontrado: ${tenant.name} (${tenant.subdomain})`);

            // ✨ IMPORTANTE: Guardar tenant en el contexto Y en el request
            this.tenantContextService.setTenant(tenant);
            req.tenant = tenant; // 👈 Agregar esto

            next();
        } catch (error) {
            console.error('❌ Error en TenantContextMiddleware:', error.message);
            next(error);
        }
    }

    private extractSubdomain(hostname: string): string | null {
        console.log(`🌐 Hostname recibido: ${hostname}`);

        if (
            hostname === 'localhost' ||
            hostname.startsWith('127.0.0.1') ||
            hostname.startsWith('192.168') ||
            hostname.startsWith('10.')
        ) {
            return null;
        }

        if (hostname.includes('.auraapp.io')) {
            const parts = hostname.split('.');
            if (parts.length >= 3) {
                return parts[0];
            }
        }

        const parts = hostname.split('.');
        if (parts.length >= 3) {
            return parts[0];
        }

        return null;
    }
}