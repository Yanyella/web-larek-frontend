import { ICard } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

//интерфейс действий над карточкой
export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

// категории карточек 

export const categoryMap: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	кнопка: 'card__category_button',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
};

// класс представления карточки 

export class Card extends Component<ICard> {

    protected cardId: string; 
    protected cardText: HTMLElement; 
    protected cardImage: HTMLImageElement; 
    protected cardTitle: HTMLElement; 
    protected cardCategory: HTMLElement; 
    protected cardPrice: HTMLElement; 
    protected cardButton: HTMLButtonElement;
    protected events: IEvents;
    
    
    constructor(protected container: HTMLElement, events: IEvents, operation?: ICardAction) {
        super(container);

        this.cardText = container.querySelector('.card__text'); 
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardTitle = container.querySelector('.card__title'); 
        this.cardCategory = container.querySelector('.card__category'); 
        this.cardPrice = container.querySelector('.card__price'); 
        this.cardButton = container.querySelector('.card__button');
        this.events = events;

        if(operation?.onClick) {
            if (this.cardButton) {
				this.cardButton.addEventListener('click', operation.onClick);
			} else {
				container.addEventListener('click',operation.onClick);
			}
        }
    }

    // получение ID карточки

    get id() {
        return this.cardId;
    }

    // сохранение ID карточки

    set id(id) {
        this.cardId = id;
    }

    // сохранение описания карточки

    set description(description: string) {
        this.setText(this.cardText, description)
    }

    // сохранение картинки карточки

    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    }    

    // сохранение названия карточки

    set title(title: string) {
        this.setText(this.cardTitle, title)
    }

    // сохранение категории карточки

    set category(category: string) {
        this.setText(this.cardCategory, category);

        Object.entries(categoryMap).forEach(([name, className]) => {
            this.toggleClass(this.cardCategory, className, name === category);
        });
    }

    // сохранение цены карточки

    set price(price: number | null) {
        price === null ? this.setText(this.cardPrice, `бесценно`) : this.setText(this.cardPrice, `${price} синапсов`); 
    }
   
}
