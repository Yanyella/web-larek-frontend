import { ICard, IBasket } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { createElement, ensureElement } from "../../utils/utils";

// интерфейс кнопки
interface IItemInBasketActions {
  onClick: (event: MouseEvent) => void;
}

// класс представления корзины

export class Basket extends Component<IBasket> {

    protected _basketList: HTMLElement; // список товаров
    protected _basketButton: HTMLButtonElement; // кнопка оформления заказа
    protected _basketPrice: HTMLSpanElement; // общая стоимость заказа
    protected _basketItemDelete: HTMLButtonElement; // кнопка удаления карточки
    protected events: IEvents;
    
    constructor(protected container: HTMLElement, events: IEvents, protected action?: IItemInBasketActions) {
        super(container);
        this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this._basketButton = container.querySelector(`.basket__button`);
        this._basketPrice = ensureElement<HTMLElement>(`.basket__price`, this.container);
        this._basketItemDelete = this.container.querySelector('.basket__item-delete');
        this.events = events;

        // кнопка оформления заказа

        if (this._basketButton) {
			this._basketButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

        // кнопка удаления карточки

         if (this._basketItemDelete) {
            this._basketItemDelete.addEventListener('click', (evt) => {
                this.container.remove();
                action?.onClick(evt);
            });
        }
    }

    // состояние кнопки оформления заказа

    set updateButton(items: ICard[]) {
		const hasValidItems = items.some(item => item.price > 0);
        this.setDisabled(this._basketButton, !hasValidItems);
	}

    // показывает общую стоимость товара в корзине 

    set price(value: number) {
        this.setText(this._basketPrice, `${value} синапсов`);
	}

    // обновляет список товаров в корзине

    set cards(items: HTMLElement[]) {

		if (items.length) {
			this._basketList.replaceChildren(...items);
			this.setDisabled(this._basketButton, !true);
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._basketButton, false);
		}
	}
}
