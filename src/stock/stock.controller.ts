import { Controller, Get, Post, Body, Response, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { Request } from 'express';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async getUserStocks(@Req() req: Request, @Response() res) {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user session' });
    }

    try {
      const userStocks = await this.stockService.getStocksByUser(userId);
      return res.json({
        stocks: userStocks,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching stocks', error });
    }
  }

  // Buy stock
  @Post('buy')
  async buyStock(
    @Body() body: { stockName: string; quantity: number },
    @Req() req: Request,
    @Response() res,
  ) {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user session' });
    }

    try {
      const result = await this.stockService.buyStock(
        userId,
        body.stockName,
        body.quantity,
      );
      return res.json({ message: 'Stock bought successfully', result });
    } catch (error) {
      return res.status(500).json({ message: 'Error buying stock', error });
    }
  }

  // Sell stock
  @Post('sell')
  async sellStock(
    @Body() body: { stockName: string; quantity: number },
    @Req() req: Request,
    @Response() res,
  ) {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user session' });
    }

    try {
      const result = await this.stockService.sellStock(
        userId,
        body.stockName,
        body.quantity,
      );
      return res.json({ message: 'Stock sold successfully', result });
    } catch (error) {
      return res.status(500).json({ message: 'Error selling stock', error });
    }
  }
}
