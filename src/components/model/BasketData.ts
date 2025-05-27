import { IBasket, ICard } from '../../types';
import { IEvents } from '../base/events';

// Класс данных корзины
export class BasketData implements IBasket {
	protected _cards: ICard[]; // массив карточек

	constructor(protected events: IEvents) {
		this.events = events;
		this._cards = [];
	}

	// возвращает массив карточек

	get cards(): ICard[] {
		return this._cards;
	}

	// возвращает общую стоимость, добавленных в корзину карточек

	get total(): number {
		return this._cards.reduce((a, b) => a + b.price, 0);
	}

	// возвращает количество карточек, добавленных в корзину

	get countCard(): number {
		return this._cards.length;
	}

	// проверяет добавлена ли карточка в корзину

	cardInBasket(item: ICard): boolean {
		return this._cards.some((card) => card.id === item.id);
	}

	// статус кнопки в зависимости от цены карточки

	getButtonStatus(item: ICard): string {
		if (item.price <= 0 || String(item.price).includes('Бесценно')) {
			return 'Нельзя купить';
		}
		return this.cardInBasket(item) ? 'Удалить из корзины' : 'В корзину';
	}

	// добавление карточек в корзину и изменение общей стоимости

	addCard(item: ICard): void {
		if (item.price === null || item.price < 0) return;
		if (this.cardInBasket(item)) return;

		this._cards.push({ ...item });
		this.events.emit('basket:change', this._cards);
	}

	// удаление карточки из корзины

	removeItemFromBasket(item: ICard): void {
		const index = this._cards.indexOf(item);
		if (index > -1) {
			this._cards.splice(index, 1);
			this.events.emit('basket:changed', this._cards);
		}
	}

	// очищает корзину

	clearBasket(): void {
		this._cards = [];
		this.events.emit('basket:changed');
	}
}
