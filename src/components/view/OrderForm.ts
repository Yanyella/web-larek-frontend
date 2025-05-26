import { Form } from './Form';
import { IOrder } from '../../types';
import { IEvents } from '../base/events';

// класс представления формы заказа
export class OrderForm extends Form<IOrder> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _activeButton: HTMLButtonElement | null = null;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = container.querySelector('[name="card"]');
		this._cash = container.querySelector('[name="cash"]');

		// Добавляем обработчики кликов для кнопок оплаты

		this._card.addEventListener('click', () =>
			this.toggleActiveButton(this._card)
		);
		this._cash.addEventListener('click', () =>
			this.toggleActiveButton(this._cash)
		);
	}

	// Переключение активной кнопки

	protected toggleActiveButton(button: HTMLButtonElement) {
		if (this._activeButton) {
			this._activeButton.classList.remove('button_alt-active');
		}

		button.classList.add('button_alt-active');
		this._activeButton = button;

		// Обновляем модель с выбранным способом оплаты

		this.onInputChange('payment', button.name);
	}

	// Установка активной кнопки по умолчанию

	set payment(value: string) {
		if (value === 'card') {
			this.toggleActiveButton(this._card);
		} else if (value === 'cash') {
			this.toggleActiveButton(this._cash);
		}
	}

	// сохранение адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
