import { IContacts } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

// класс представления формы контактных данных

export class ContactsForm extends Form<IContacts> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);
		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
	}

	// сохранение электронного адреса пользователя

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	// сохранение телефона пользователя

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
