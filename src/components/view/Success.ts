import { Component } from '../base/Component';
import { ISuccess } from '../../types';
import { IEvents } from '../base/events';

interface ISuccessActions {
	onClick: () => void;
}

// класс представления модального окна завершения заказа

export class Success extends Component<ISuccess> {
	protected orderSuccessDescription: HTMLElement; // описание заказа
	protected orderSuccessClose: HTMLButtonElement; // кнопка закрытия окна
	protected events: IEvents;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		operation?: ISuccessActions
	) {
		super(container);

		this.orderSuccessDescription = container.querySelector(
			'.order-success__description'
		);
		this.orderSuccessClose = container.querySelector('.order-success__close');
		this.events = events;

		if (operation?.onClick) {
			if (this.orderSuccessClose) {
				this.orderSuccessClose.addEventListener('click', operation.onClick);
			}
		}
	}

	// сохранение окончательной стоимости заказа

	set total(value: number) {
		this.setText(this.orderSuccessDescription, `Списано + ${value} + синапсов`);
	}
}
