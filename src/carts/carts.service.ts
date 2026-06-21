import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItems } from './entities/cart-items.entity';
import { AddItemDto } from './dto/add-item.dto';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class CartsService {
  constructor(
    private readonly bookService: BooksService,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItems)
    private readonly cartItemRepository: Repository<CartItems>,
  ) {}

  async create(userId: number) {
    const new_cart = this.cartRepository.create({ userId });
    return await this.cartRepository.save(new_cart);
  }

  async getUserCart(id: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId: id },
      relations: ['items', 'items.book'],
    });
    if (!cart) throw new NotFoundException('سبد خرید یافت نشد');

    return cart;
  }

  async addItem(userId: number, addItemDto: AddItemDto) {
    const { bookId, quantity } = addItemDto;
    const book = await this.bookService.findOne(bookId);
    if (!book) throw new NotFoundException('کتاب یافت نشد');

    const cart = await this.getUserCart(userId);
    const existingItem = cart.items.find((item) => item.book.id === bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        book,
        quantity,
      });
      cart.items.push(newItem);
      await this.cartItemRepository.save(newItem);
    }
    return this.getUserCart(userId);
  }

  async removeItemToCart(userId: number, itemId: number) {
    const cart = await this.getUserCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1)
      throw new NotFoundException('آیتم در سبد خرید یافت نشد');
    await this.cartItemRepository.remove(cart.items[itemIndex]);
    return {
      message: 'آبتم با موفقیت حذف شد',
    };
  }
  async clearCart(userId: number) {
    const cart = await this.getUserCart(userId);
    if (cart.items.length === 0)
      return {
        message: 'سبد خرید خالی است',
      };
    await this.cartItemRepository.delete(cart.items);
    return {
      message: 'سبد خرید خالی شد',
    };
  }
}
