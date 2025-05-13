import { ICard, ICardsList } from "../../types";
import { IEvents } from "../base/events";

export class CardsData implements ICardsList {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected _count: number;
    protected events: IEvents;

    constructor(events: IEvents) {
        this._cards = [];
        this._preview = null;
        this._count = 0;
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

    getCard(cardId: string) {
        return this._cards.find((item) => item.id === cardId)
    }
   
    setPreview(card: ICard): void {
		this._preview = card.id;
		this.events.emit('preview:change', card);
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