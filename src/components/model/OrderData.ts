import { IUser, TPayment } from '../../types';
import { IEvents } from '../base/events';
export class OrderData implements IUser {
	protected _payment: TPayment = 'card'; // инициализация по умолчанию
	protected _email = '';
	protected _phone = '';
	protected _address = '';
	protected _total = 0;
	protected _items: string[] = [];
	protected formErrors: Partial<Record<keyof IUser, string>> = {};
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	// сохранение способа оплаты

	set payment(value: TPayment) {
		this._payment = value;
		this.validateOrder();
	}

	// сохранение электронного адреса

	set email(value: string) {
		this._email = value;
		this.validateContacts();
	}

	// сохранение телефона

	set phone(value: string) {
		this._phone = value;
		this.validateContacts();
	}

	// сохранение адреса доставки

	set address(value: string) {
		this._address = value;
		this.validateOrder();
	}

	// сохранение полной стоимости

	set total(value: number) {
		this._total = value;
	}

	// сохранение массива id карточек

	set items(value: string[]) {
		this._items = value;
	}

	// метод проверки заполнения всех полей

	isOrderFormValid(): boolean {
		return !!this._address && !!this._payment;
	}

	// устанавливает значения всех полей

	setOrderField(field: keyof IUser, value: string) {
		if (field === 'email' || field === 'phone' || field === 'address') {
			this[field] = value;
		} else if (field === 'payment') {
			this.payment = value as TPayment;
		}

		if (field === 'email' || field === 'phone') {
			this.validateContacts();
		} else if (field === 'address' || field === 'payment') {
			this.validateOrder();
		}
	}

	// валидация данных заказа (адрес, способ оплаты)

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this._address) {
			errors.address = 'Не указан адрес';
		}
		if (!this._payment) {
			errors.payment = 'Не указан способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		const isValid = Object.keys(errors).length === 0;
		if (isValid) {
			this.events.emit('order:ready', this.getOrderData());
		}
		return isValid;
	}

	// валидация данных заказа (электронный адрес, телефон)

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this._email) {
			errors.email = 'Не указан email';
		}
		if (!this._phone) {
			errors.phone = 'Не указан телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		const isValid = Object.keys(errors).length === 0;
		if (isValid) {
			this.events.emit('contacts:ready', this.getOrderData());
		}
		return isValid;
	}

	// очистка данных

	clearOrder(): void {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
		this._total = 0;
		this._items = [];
		this.formErrors = {};
	}

	// получение данных

	getOrderData(): IUser {
		return {
			payment: this._payment,
			email: this._email,
			phone: this._phone,
			address: this._address,
			total: this._total,
			items: this._items,
		};
	}
}
