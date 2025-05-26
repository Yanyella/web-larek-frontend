import { Component } from '../base/Component';
import { ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
interface ISuccessActions {
	onClick: () => void;
}

// класс представления модального окна завершения заказа
export class Success extends Component<ISuccess> {
	protected _orderSuccessDescription: HTMLElement; // описание заказа
	protected _orderSuccessClose: HTMLButtonElement; // кнопка закрытия окна
	protected events: IEvents;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		operation?: ISuccessActions
	) {
		super(container);

		this._orderSuccessDescription = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._orderSuccessClose = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this.events = events;

		if (operation?.onClick) {
			this._orderSuccessClose.addEventListener('click', operation.onClick);
		} else {
			container.addEventListener('click', operation.onClick);
		}
	}

	// сохранение окончательной стоимости заказа

	set total(value: number) {
		this.setText(this._orderSuccessDescription, `Списано ${value} синапсов`);
	}
}
