import { Form } from './Form';
import { IOrder } from '../../types';
import { IEvents } from '../base/events';

// класс представления формы заказа
export class OrderForm extends Form<IOrder> {
	protected _paymentButtons: HTMLButtonElement[]; // способы оплаты

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this._paymentButtons = [
			...container.querySelectorAll<HTMLButtonElement>('.button_alt'),
		];

		for (const button of this._paymentButtons) {
			button.addEventListener('click', (e: Event) => {
				events.emit('button:select', {
					button: e.target as HTMLButtonElement,
				});
			});
		}
	}

	// сохранение адреса

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
