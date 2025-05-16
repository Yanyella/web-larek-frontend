import { ICard, IBasket } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { createElement, ensureElement } from "../../utils/utils";

// Класс данных корзины
export class BasketData implements IBasket {
    protected _cards: ICard[]; // массив карточек
    protected _total: number; // общая стоимость

    constructor(protected events: IEvents) {
        this.events = events;
        this._cards = [];
        this._total = 0;
    }
    
    // возвращает массив карточек 

    get cards(): ICard[] {
        return this._cards;
    }

    // возвращает общую стоимость добавленных в корзину карточек 

    get total(): number {
		return this._cards.reduce((a, b) => a + b.price, 0);
	};

    // проверяет добавлена ли карточка в корзину 

    private cardInBasket(item: ICard): boolean {
        return this._cards.some(card => card.id === item.id);
    }
     
    // статус кнопки в зависимости от цены карточки

    getButtonStatus(item: ICard): string {
        if (item.price <= 0 || String(item.price).includes('Бесценно')) {
            return 'Нельзя купить';
        }
        return this.cardInBasket(item) ? 'Удалить из корзины' : 'В корзину';
    }

    // добавление карточек в корзину и изменение общей стоимости

    addCard(item: ICard): void {
        if (item.price === null || item.price < 0) return; 
        if (this.cardInBasket(item)) return; 

        this._cards.push({...item});
        this._total += item.price;
        this.events.emit('basket:change', this._cards);
    }
   
    // удаление карточки из корзины 

    removeItemFromBasket(item: ICard): void {
        this._cards = this._cards.filter(card => {
        if (card.id === item.id) {
            this._total -= card.price ?? 0;
            return false;
        }
            return true;
        });
        this.events.emit('basket:changed', this._cards);
    }

    // очищает корзину 

    clearBasket(): void {
        this._cards = [];
        this._total = 0;
        this.events.emit('basket:changed');
    }
}
