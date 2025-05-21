import { Component } from '../base/Component';
import { IPage } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// класс представления главной страницы

export class Page extends Component<IPage> {
	protected _pageWrapper: HTMLElement; // обертка страницы
	protected _headerBasket: HTMLButtonElement; // иконка корзины
	protected _headerBasketCounter: HTMLSpanElement; // количество карточек в корзине
	protected _gallery: HTMLElement; // массив карточек

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._pageWrapper = container.querySelector('.page__wrapper');
		this._headerBasket = container.querySelector('.header__basket');
		this._headerBasketCounter = container.querySelector(
			'.header__basket-counter'
		);
		this._gallery = ensureElement<HTMLElement>('.gallery');

		this._headerBasket.addEventListener('click', () => {
			this.events.emit('basket:open', this);
		});
	}

	// сохранение карточек

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	// блокироввка страницы

	set pageLocked(value: boolean) {
		this.toggleClass(this._pageWrapper, 'page__wrapper_locked', value);
	}

	// сохранение количества карточек

	setBasketCounter(value: number) {
		this.setText(this._headerBasketCounter, String(value));
	}
}
