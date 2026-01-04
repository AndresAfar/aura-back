// src/modules/master/tenants/dto/create-tenant.dto.ts
import { TenantType } from '../entities/tenant.entity';

export class CreateTenantDto {
    name: string;
    subdomain: string;
    type?: TenantType;
    config?: {
        logo?: string;
        primary_color?: string;
        currency?: string;
        timezone?: string;
        language?: string;
        contact_email?: string;
        contact_phone?: string;
    };
}
