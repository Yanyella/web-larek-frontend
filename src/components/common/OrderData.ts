import { IUser, TPayment, UserPayAndDelivery, UserEmailAndPhone } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { createElement, ensureElement } from "../../utils/utils";

// Класс данных заказа

export class OrderData implements IUser {

    protected _payment: TPayment | string = ''; // способ оплаты
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

    set payment(value: TPayment | string) {
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

    // сохранение цены 

    set total(value: number) {
        this._total = value;
    }

    // сохранение массива карточек

    set items(value: string[]) {
        this._items = value;
    }
    
    // проверка заполнения всех полей (способ оплаты, цена)

    setOrderField(field: keyof Pick<UserPayAndDelivery, 'payment' | 'address'>, value: string) {
        this[field] = value;
        
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.getOrderData());
        }
    }

     // проверка заполнения всех полей (электронный адрес, телефон)

    setContactsField(field: keyof Pick<UserEmailAndPhone, 'email' | 'phone'>, value: string) {
        this[field] = value;

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
        this._payment = '';
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
            items: this._items
        };
    }
}
