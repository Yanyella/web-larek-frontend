import { ICard, IBasket } from '../../types';
import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { createElement } from '../../utils/utils';

// класс представления корзины

export class Basket extends Component<IBasket> {
	protected _basketList: HTMLElement; // список товаров
	protected _basketButton: HTMLButtonElement; // кнопка оформления заказа
	protected _basketPrice: HTMLSpanElement; // общая стоимость заказа
	protected events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this._basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._basketButton = container.querySelector(`.basket__button`);
		this._basketPrice = this.container.querySelector('.basket__price');

		this.events = events;

		// кнопка оформления заказа

		if (this._basketButton) {
			this._basketButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	// состояние кнопки оформления заказа

	set updateButton(items: ICard[]) {
		const hasValidItems = items.some((item) => item.price > 0);
		this.setDisabled(this._basketButton, !hasValidItems);
	}

	// показывает общую стоимость товара в корзине

	set price(value: number) {
		this.setText(this._basketPrice, `${value} синапсов`);
	}

	// обновляет список товаров в корзине

	set cards(items: HTMLElement[]) {
		this._basketList.replaceChildren(...items);
		if (items.length > 0) {
			this.setDisabled(this._basketButton, false);
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._basketButton, true);
		}
	}
}
