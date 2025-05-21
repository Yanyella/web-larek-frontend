import { ICardsList, ICard } from '../../types';
import { IEvents } from '../base/events';

// класс данных карточки
export class CardsData implements ICardsList {
	protected _cards: ICard[]; // массив карточек
	protected _preview: string | null; // превью
	protected events: IEvents;

	constructor(events: IEvents) {
		this._cards = [];
		this._preview = null;
		this.events = events;
	}

	// получение массива карточек

	get cards(): ICard[] {
		return this._cards;
	}

	// сохранение массива карточек и количества карточек

	set cards(value: ICard[]) {
		this._cards = value;
		this.events.emit('cards:changed', value);
	}

	// возврат ID карточки

	getCard(cardId: string) {
		return this._cards.find((item) => item.id === cardId);
	}

	// сохранение ID карточки для превью

	setPreview(card: ICard): void {
		this._preview = card.id;
		this.events.emit('preview:change', card);
	}

	// получение превью карточки

	get preview(): string | null {
		return this._preview;
	}
}
