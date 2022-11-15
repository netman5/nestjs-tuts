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

  getAProduct(prodId: string) {
    const product = this.findProduct(prodId)[0];
    return { ...product };
  }

  updateSingleProduct(
    prodId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const [product, index] = this.findProduct(prodId);
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

    this.products[index] = updatedProduct;
  }

  deleteProduct(prodId: string) {
    const index = this.findProduct(prodId)[1];
    this.products.splice(index, 1);
  }

  private findProduct(id: string): [Product, number] {
    const productIdx = this.products.findIndex((prod) => prod.id === id);
    const product = this.products[productIdx];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIdx];
  }
}
