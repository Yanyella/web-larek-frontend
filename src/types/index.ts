// Типы данных
// Описание структуры данных товара
export interface ICard {
	id: string; // идентификатор товара
	description: string; // описание товара
	image: string; // url товара
	title: string; // название товара
	category: string; // категория товара
	price: number | null; // цена товара
}

// Описание интерфейса пользователя

export type TPayment = 'cash' | 'card';
export interface IUser {
	payment: TPayment; // способ оплаты товара
	email: string; // элетронный адрес пользователя
	phone: string; // телефон пользователя
	address: string; // адрес доставки
	total: number; // полная стоимость товара
	items: string[];
}

// Описание стркутры данных массива карточек
export interface ICardsList {
	cards: ICard[];
	getCard(cardId: string): ICard | undefined;
}

// Описание стркутуры данных корзины
export interface IBasket {
	cards: ICard[]; // массив товаров в корзине
}

export interface IPage {
	count: number;
	gallery: HTMLElement[];
	closed: boolean;
}
export interface IOrder {
	payment: string;
	address: string;
}

export interface IContacts {
	email: string;
	phone: string;
}

// Описание стркутуры для отображения успешного завершения заказа
export interface ISuccess {
	total: number;
}

// Описание стркутуры итогового заказа
export interface IOrderResult {
	id: string;
	total: number;
}

// типизация методов Api

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';
