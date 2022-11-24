import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) { }

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });
    const product = await newProduct.save();
    return product._id;
  }

  async getAllProducts() {
    const allProducts = await this.productModel.find({}).exec();
    return [...allProducts];
  }

  async getAProduct(prodId: string) {
    const product = await this.productModel.findById(prodId).exec();
    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  updateSingleProduct(
    prodId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const [product, idx] = this.findProduct(prodId);
    const updatedProduct = { ...product };

    if (title) {
      updatedProduct.title = title;
    }

    if (desc) {
      updatedProduct.description = desc;
    }

    if (price) {
      updatedProduct.price = price;
    }

    this.products[idx] = updatedProduct;
  }

  async deleteProduct(prodId: string) {
    const index = await this.productModel.findOneAndRemove(prodId).exec();
    return index;
  }
}
