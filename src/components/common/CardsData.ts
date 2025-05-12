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

    getCard(cardId: string): ICard | undefined {
        return this._cards.find((item) => item.id === cardId);
    }
   
    setCardPreview(cardId: string | null) {
        this._preview = null;
        if (!cardId) return;

        const selectedCard = this.getCard(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected', selectedCard);
        }
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