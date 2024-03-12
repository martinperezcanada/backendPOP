import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateProductDto } from '../dtos/product/create-product.dto';
import { UpdateProductDto } from '../dtos/product/update-product.dto';
import { ProductService } from '../services/product/product.service';
import { ProductEntity } from '../entities/product/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(@Query() query: any): Promise<{ status: string; data: ProductEntity[] }> {
    try {
      const { page = 1, pageSize = 10, ...filters } = query;
      const products = await this.productsService.getAllProducts({ filters, page, pageSize });
      return { status: 'Ok', data: products };
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  }
  
  @Get('count')
  async getAllProductsCount(): Promise<{ status: string; count: number }> {
    try {
      const count = await this.productsService.getAllProductsCount();
      return { status: 'Ok', count };
    } catch (error) {
      console.error('Error in getAllProductsCount:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
