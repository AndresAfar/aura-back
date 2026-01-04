// src/modules/tenant/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, IsArray, Min } from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
    @IsString()
    sku: string;

    @IsOptional()
    @IsString()
    barcode?: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(0)
    cost_price: number;

    @IsNumber()
    @Min(0)
    sale_price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    tax_rate?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock_quantity?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    min_stock?: number;

    @IsOptional()
    @IsString()
    unit?: string;

    @IsOptional()
    @IsArray()
    images?: string[];

    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @IsOptional()
    metadata?: {
        brand?: string;
        model?: string;
        category?: string;
        tags?: string[];
    };
}