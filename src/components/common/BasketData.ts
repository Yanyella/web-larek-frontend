import { ICard, IBasket } from "../../types";
import { IEvents } from "../base/events";

export class BasketData implements IBasket {
    protected _cards: ICard[];

    constructor(protected events: IEvents) {
        this._cards = [];
    }
    
    get cards(): ICard[] {
        return this._cards;
    }

    // Метод для определения статуса кнопки

    getButtonStatus(item: ICard): string {
    
    const isUnavailable = (
        item.price === null ||
        item.price === undefined ||
        Number(item.price) <= 0 ||
        String(item.price).toLowerCase().includes('бесценно')
    );
    
    if (isUnavailable) {
        return 'Нельзя купить';
    }

    const isInBasket = this._cards.some(card => card.id === item.id);
    
    return isInBasket ? 'Удалить из корзины' : 'В корзину';
    }

    // Метод добавления карточки в корзину 

    addCard(item: ICard) {
        this._cards.push(item);
        this.events.emit('basket:changed', this._cards);
    }
}