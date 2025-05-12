import { ICard, ICardsList } from "../../types";
import { IEvents } from "../base/events";

export class CardsData implements ICardsList {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected _count: number;
    protected events: IEvents;

    constructor(events: IEvents) {
        this._cards = []; // инициализация
        this._preview = null; // инициализация
        this._count = 0; // инициализация
        this.events = events;
    }
    
    get cards(): ICard[] {
        return this._cards;
    }

    set cards(value: ICard[]) {
        this._cards = value;
        this._count = value.length;
        this.events.emit('cards:changed', value);
    }

    getCardPreview(id: string) {
        return this._cards.find(card => card.id === id) || null;
    }

    cardIdPreview(item: ICard): void {
		if (!item) return; 
        this._preview = item.id;
        this.events.emit('preview:change', item);
	}

    get preview(): string | null {
		return this._preview;
	}

    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }
}