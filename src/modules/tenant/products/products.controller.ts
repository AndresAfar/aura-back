// src/modules/tenant/products/products.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TenantAccessGuard } from '../../core/guards/tenant-access.guard';
import { TenantContextInterceptor } from '../../core/tenant-context/tenant-context.interceptor';
import { CurrentTenant } from '../../core/tenant-context/decorators/current-tenant.decorator';
import { Tenant } from '../../master/tenants/entities/tenant.entity';

@Controller('products')
@UseGuards(TenantAccessGuard)
@UseInterceptors(TenantContextInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('test')
    async test(@CurrentTenant() tenant: Tenant) {
        return {
            message: '✅ El sistema multi-tenant está funcionando correctamente',
            tenant_info: {
                id: tenant.id,
                name: tenant.name,
                subdomain: tenant.subdomain,
                domain_complete: tenant.domain_complete,
                schema_name: tenant.schema_name,
                status: tenant.status,
                type: tenant.type,
            },
            instructions: 'Este endpoint confirma que el tenant ha sido identificado correctamente',
        };
    }

    @Post()
    async create(
        @Body() createProductDto: CreateProductDto,
        @CurrentTenant() tenant: Tenant,
    ) {
        const product = await this.productsService.create(createProductDto);

        return {
            message: 'Producto creado exitosamente',
            tenant: {
                name: tenant.name,
                schema: tenant.schema_name,
            },
            product,
        };
    }

    @Get()
    async findAll(@CurrentTenant() tenant: Tenant) {
        const products = await this.productsService.findAll();

        return {
            tenant: {
                name: tenant.name,
                subdomain: tenant.subdomain,
                schema: tenant.schema_name,
            },
            total: products.length,
            products,
        };
    }

    @Get('low-stock')
    async getLowStock(@CurrentTenant() tenant: Tenant) {
        const products = await this.productsService.getLowStock();

        return {
            tenant: tenant.name,
            total: products.length,
            products,
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentTenant() tenant: Tenant) {
        const product = await this.productsService.findOne(id);

        return {
            tenant: tenant.name,
            product,
        };
    }

    @Get('barcode/:barcode')
    async findByBarcode(@Param('barcode') barcode: string) {
        return this.productsService.findByBarcode(barcode);
    }

    @Get('sku/:sku')
    async findBySku(@Param('sku') sku: string) {
        return this.productsService.findBySku(sku);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    @Patch(':id/stock')
    async updateStock(
        @Param('id') id: string,
        @Body() body: { quantity: number },
    ) {
        return this.productsService.updateStock(id, body.quantity);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.productsService.remove(id);
        return {
            message: 'Producto eliminado (soft delete)',
        };
    }
}