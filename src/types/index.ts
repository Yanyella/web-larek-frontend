// Типы данных
// Описание структуры данных товара
export interface ICard {
	id: string; // идентификатор товара
    description: string; // описание товара
    image: string; // url товара
    title: string; // название товара
    category: string; // категория товара
    price: number | null; // цена товара
    cardButton: string;
}

// Описание интерфейса пользователя

export type TPayment  = 'cash' | 'card';
export interface IUser {
	payment?: TPayment | string; // способ оплаты товара
    email?: string; // элетронный адрес пользователя
    phone?: string; // телефон пользователя
    address?: string; // адрес доставки
    total?: number; // полная стоимость товара 
    items: string []; 
}

export interface IUserResponce {
	id: string;
	total: number;
}

// Описание стркутры данных массива карточек
export interface ICardsList {
    cards: ICard[];
    count: number;
    getCardPreview(id: string): void;
    cardIdPreview(item: ICard): void;
}

// Описание стркутуры данных корзины
export interface IBasket{
    cards: ICard[]; // массив товаров в корзине
    total: number; // стоимость товара в корзине
    addCardandUpdateTotal(card: ICard): void // добавление товара в корзину и обновление общей стоимости
    hasCardInBasket(cardId: string): boolean // проверка есть ли товар в корзине
    removeCardandUpdateTotal(cardId: string): void; // удаление товара из корзины и обновление общей стоимости
    clearBasket() : void // метод очистки корзины
    getBasketCountCards(): void // метод возвращающий количество товара в корзине
}

export interface IPage {
    count: number;
    gallery: HTMLElement[];
    closed: boolean;
}

// Описание стркутуры для отображения успешного завершения заказа
export interface ISuccessView {
    total: string;
}

// типизация данных пользвателя в модальном окне с выбором способа оплаты и указания адреса отправки */

export type UserPayAndDelivery = Pick<IUser, 'payment' | 'address'>; 

// типизация данных пользвателя в модальном окне с выбором способа оплаты и указания адреса отправки 

export type UserEmailAndPhone = Pick<IUser, 'email' | 'phone'>; 

// типизация методов Api

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';