import { IUser, TPayment, IOrder, IContacts } from '../../types';
import { IEvents } from '../base/events';

// Класс данных заказа
export class OrderData implements IUser {
	protected _payment: TPayment; // способ оплаты
	protected _email = ''; // электронный адрес
	protected _phone = ''; // телефон
	protected _address = ''; // адресс
	protected _total = 0; // цена заказа
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
		this.validateInfo();
	}

	// сохранение телефона

	set phone(value: string) {
		this._phone = value;
		this.validateInfo();
	}

	// сохранение адреса

	set address(value: string) {
		this._address = value;
		this.validateOrder();
	}

	get total(): number {
		return this._total;
	}

	get items() {
		return this._items;
	}

	// проверка заполнения всех полей (способ оплаты, цена)

	setOrderField(field: keyof IOrder, value: string) {
		if (field === 'payment') {
			this.payment = value as TPayment;
		} else {
			this.address = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.getOrderData());
		}
	}

	// проверка заполнения всех полей (электронный адрес, телефон)

	setContactsField(field: keyof IContacts, value: string) {
		if (field === 'email') {
			this.email = value;
		} else {
			this.phone = value;
		}

		if (this.validateInfo()) {
			this.events.emit('contacts:ready', this.getOrderData());
		}
	}

	// валидация при заполнении способа оплаты и адреса

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this._payment) {
			errors.payment = 'Не указан способ оплаты';
		}
		if (!this._address) {
			errors.address = 'Не указан адрес';
		}

		this.formErrors = errors;
		this.events.emit('orderDate:validation', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// валидация при заполнении элетронного адреса и телефона

	validateInfo(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this._email) {
			errors.email = 'Не указан email';
		}
		if (!this._phone) {
			errors.phone = 'Не указан телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsDate:validation', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// очистка форм

	clearOrder(): void {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
		this._total = 0;
		this._items = [];
		this.formErrors = {};
	}

	// возврат данных

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
