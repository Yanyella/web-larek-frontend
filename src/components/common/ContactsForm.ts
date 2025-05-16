import { IContacts } from "../../types";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";

// класс представления формы контактных данных

export class ContactsForm extends Form<IContacts> {

   constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

   // сохранение телефона пользователя 

   set phone(value: string) {
      (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
   }

   // сохранение электронного адреса пользователя 
   
	set email(value: string) {
      (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
   }
}