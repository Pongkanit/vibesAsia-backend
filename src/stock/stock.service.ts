import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from './stock.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
  ) {}

  async getStocksByUser(userId: string) {
    return this.stockModel.find({ user: userId }).exec();
  }

  // Buy stock
  async buyStock(userId: string, stockName: string, quantity: number) {
    const stock = await this.stockModel.findOne({
      user: userId,
      name: stockName,
    });

    if (stock) {
      stock.currentHold += quantity;
      return stock.save();
    } else {
      // If the stock doesn't exist, create a new entry
      const newStock = new this.stockModel({
        user: userId,
        name: stockName,
        currentHold: quantity,
      });
      return newStock.save();
    }
  }

  // Sell stock
  async sellStock(userId: string, stockName: string, quantity: number) {
    const stock = await this.stockModel.findOne({
      user: userId,
      name: stockName,
    });

    if (!stock) {
      throw new Error('Stock not found for user');
    }

    if (stock.currentHold < quantity) {
      throw new Error('Insufficient stock holdings');
    }

    stock.currentHold -= quantity;
    return stock.save();
  }
}
