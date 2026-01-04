// src/modules/master/tenants/tenants.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Tenant, TenantStatus, TenantType } from '../entities/tenant.entity';

export interface CreateTenantDto {
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

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant, 'master')
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain, deleted_at: IsNull() },
      relations: ['plan', 'owners'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant con subdomain "${subdomain}" no encontrado`);
    }

    this.validateTenantStatus(tenant);

    return tenant;
  }

  async findByDomainComplete(domain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { domain_complete: domain, deleted_at: IsNull() },
      relations: ['plan', 'owners'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant con dominio "${domain}" no encontrado`);
    }

    this.validateTenantStatus(tenant);

    return tenant;
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['plan', 'owners', 'subscriptions'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant con ID "${id}" no encontrado`);
    }

    return tenant;
  }

  async create(createDto: CreateTenantDto): Promise<Tenant> {
    // Validar subdomain
    if (!/^[a-z0-9-]+$/.test(createDto.subdomain)) {
      throw new BadRequestException(
        'El subdomain solo puede contener letras minúsculas, números y guiones',
      );
    }

    // Verificar si ya existe
    const existing = await this.tenantRepository.findOne({
      where: [
        { subdomain: createDto.subdomain },
        { name: createDto.name },
      ],
    });

    if (existing) {
      throw new BadRequestException('Ya existe una tienda con ese nombre o subdomain');
    }

    // Generar schema name único
    const schemaName = `tenant_${createDto.subdomain}_${Date.now()}`;

    // Generar dominio completo
    const domainComplete = `${createDto.subdomain}.auraapp.io`;

    // Calcular fecha de fin de trial (14 días por defecto)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const tenant = this.tenantRepository.create({
      name: createDto.name,
      subdomain: createDto.subdomain,
      domain_complete: domainComplete,
      schema_name: schemaName,
      type: createDto.type || TenantType.GENERAL,
      status: TenantStatus.TRIAL,
      trial_ends_at: trialEndsAt,
      config: {
        currency: 'COP',
        timezone: 'America/Bogota',
        language: 'es',
        ...createDto.config,
      },
      limits: {
        max_products: 100, // Plan trial limitado
        max_users: 3,
        max_storage_mb: 100,
        max_transactions_monthly: 100,
      },
      total_products: 0,
      total_users: 0,
      total_sales: 0,
    });

    const saved = await this.tenantRepository.save(tenant);

    // TODO: Crear el schema en PostgreSQL
    await this.createTenantSchema(saved.schema_name);

    return saved;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateData: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.findById(id);

    Object.assign(tenant, updateData);

    return this.tenantRepository.save(tenant);
  }

  async softDelete(id: string): Promise<void> {
    const tenant = await this.findById(id);

    tenant.deleted_at = new Date();
    tenant.status = TenantStatus.CANCELLED;

    await this.tenantRepository.save(tenant);
  }

  async activate(id: string): Promise<Tenant> {
    const tenant = await this.findById(id);

    tenant.status = TenantStatus.ACTIVE;

    return this.tenantRepository.save(tenant);
  }

  async suspend(id: string): Promise<Tenant> {
    const tenant = await this.findById(id);

    tenant.status = TenantStatus.SUSPENDED;

    return this.tenantRepository.save(tenant);
  }

  async incrementMetric(id: string, metric: 'products' | 'users' | 'sales'): Promise<void> {
    const field = `total_${metric}`;
    
    await this.tenantRepository.increment({ id }, field, 1);
  }

  async checkLimits(tenantId: string): Promise<{
    products: { current: number; max: number; exceeded: boolean };
    users: { current: number; max: number; exceeded: boolean };
    storage: { current: number; max: number; exceeded: boolean };
  }> {
    const tenant = await this.findById(tenantId);

    return {
      products: {
        current: tenant.total_products,
        max: tenant.limits?.max_products || 0,
        exceeded: tenant.total_products >= (tenant.limits?.max_products || 0),
      },
      users: {
        current: tenant.total_users,
        max: tenant.limits?.max_users || 0,
        exceeded: tenant.total_users >= (tenant.limits?.max_users || 0),
      },
      storage: {
        current: 0, // TODO: Calcular storage real
        max: tenant.limits?.max_storage_mb || 0,
        exceeded: false,
      },
    };
  }

  private validateTenantStatus(tenant: Tenant): void {
    if (tenant.status === TenantStatus.SUSPENDED) {
      throw new BadRequestException(
        'Esta tienda está suspendida temporalmente. Contacta con soporte.',
      );
    }

    if (tenant.status === TenantStatus.CANCELLED) {
      throw new BadRequestException('Esta tienda ha sido cancelada.');
    }

    // Verificar si el trial expiró
    if (tenant.status === TenantStatus.TRIAL && tenant.trial_ends_at) {
      const now = new Date();
      if (now > tenant.trial_ends_at) {
        throw new BadRequestException(
          'El período de prueba ha expirado. Por favor actualiza tu plan.',
        );
      }
    }
  }

  private async createTenantSchema(schemaName: string): Promise<void> {
    try {
      // Crear el schema
      await this.tenantRepository.query(
        `CREATE SCHEMA IF NOT EXISTS ${schemaName}`,
      );

      console.log(`✅ Schema ${schemaName} creado exitosamente`);

      // TODO: Ejecutar migraciones del tenant
      // await this.runTenantMigrations(schemaName);
    } catch (error) {
      console.error(`❌ Error creando schema ${schemaName}:`, error);
      throw error;
    }
  }
}