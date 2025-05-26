import { IBasket } from '../../types';
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
		this.events = events;
		this._basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._basketPrice = this.container.querySelector('.basket__price');
		this._basketButton = this.container.querySelector('.basket__button');

		// кнопка оформления заказа

		if (this._basketButton) {
			this._basketButton.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}
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
