import { ICard } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { categoryMap } from '../../utils/constants';

//интерфейс действий над карточкой
export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

// класс представления карточки в модальном окне

export class Card extends Component<ICard> {
	protected cardId: string; // ID карточки
	protected cardText: HTMLElement; // описание карточки
	protected cardImage: HTMLImageElement; // картинка карточки
	protected cardTitle: HTMLElement; // название карточки
	protected cardCategory: HTMLElement; // категория карточки
	protected cardPrice: HTMLElement; // цена карточки
	protected cardButton: HTMLButtonElement; // кнопка добавления карточки в корзину
	protected cardIndex: HTMLElement; // интекс карточки
	protected events: IEvents;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		operation?: ICardAction
	) {
		super(container);

		this.cardText = container.querySelector('.card__text');
		this.cardImage = container.querySelector('.card__image');
		this.cardTitle = container.querySelector('.card__title');
		this.cardCategory = container.querySelector('.card__category');
		this.cardPrice = container.querySelector('.card__price');
		this.cardButton = container.querySelector('.card__button');
		this.cardIndex = container.querySelector('.basket__item-index');
		this.events = events;

		if (operation?.onClick) {
			if (this.cardButton) {
				this.cardButton.addEventListener('click', operation.onClick);
			} else {
				container.addEventListener('click', operation.onClick);
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
		this.setText(this.cardText, description);
	}

	// сохранение картинки карточки

	set image(value: string) {
		this.setImage(this.cardImage, value, this.title);
	}

	// сохранение названия карточки

	set title(title: string) {
		this.setText(this.cardTitle, title);
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
		price === null
			? this.setText(this.cardPrice, `бесценно`)
			: this.setText(this.cardPrice, `${price} синапсов`);
	}

	// получение индекса карточки

	get indexCard(): string {
		return this.cardIndex.textContent || '';
	}

	// сохранение индекса карточки

	set indexCard(value: string | string[]) {
		this.setText(this.cardIndex, value);
	}
}
