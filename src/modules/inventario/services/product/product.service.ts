import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product/product.entity';
import { CreateProductDto } from '../../dtos/product/create-product.dto';
import { UpdateProductDto } from '../../dtos/product/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAllProducts({ filters, page, pageSize }): Promise<ProductEntity[]> {
    try {
      let query = this.productRepository.createQueryBuilder('product');

      if (filters) {
        for (const key in filters) {
          if (filters.hasOwnProperty(key)) {
            if (key === 'orderByPrice') {
              if (filters[key] === 'asc') {
                query = query.orderBy('product.precio', 'ASC');
              } else if (filters[key] === 'desc') {
                query = query.orderBy('product.precio', 'DESC');
              }
            } else if (key === 'orderByName') {
              if (filters[key] === 'asc') {
                query = query.orderBy('product.nombre', 'ASC');
              } else if (filters[key] === 'desc') {
                query = query.orderBy('product.nombre', 'DESC');
              }
            } else {
              query = query.andWhere(`product.${key} = :${key}`, { [key]: filters[key] });
            }
          }
        }
      }

      const skip = (page - 1) * pageSize;
      const products = await query.skip(skip).take(pageSize).getMany();
      return products;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw new HttpException('Error al obtener los productos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllProductsCount(): Promise<number> {
    try {
      const count = await this.productRepository.count();
      return count;
    } catch (error) {
      console.error('Error al obtener el número total de productos:', error);
      throw new HttpException('Error al obtener el número total de productos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> { 
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new HttpException('Error al crear el producto', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    try {
      await this.productRepository.update(id, updateProductDto);
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new HttpException('Error al actualizar el producto', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new HttpException('Error al eliminar el producto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
