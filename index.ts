// Типы данных

// Описание стркутры данных товара

export interface ICard {
	id: string; // идентификатор товара
    description: string; // описание товара
    image: string; // url товара
    title: string; // название товара
    category: string; // категория товара
    price: number; // цена товара
}

// Описание стркутры данных пользователя

type Pay = 'Онлайн' | 'При получении'; // способы оплаты товара

export interface IUser {
	payment: Pay; // способ оплаты товара
    email: string; // элетронный адрес пользователя
    phone: string; // телефон пользователя
    address: string; // адрес доставки
    total: number; // полнас стоимость товара 
}

// Описание стркутры данных массива карточек

export interface ICardsList {
	total: number; // общее количество карточек товара на главной странице
    items: CardInfo[]; // массив товара на главной странице
    preview: string | null; // просмотр товара 
    addBasket(cardId: string, payload: Function | null): void; // добавление товара в корзину
}

// Описание стркутуры элемента данных корзины, унаследованных от карточки

export interface IBasketItem extends ICard {
    title: string; // название товара
    price: number; // цена товара 
}

// Описание стркутуры данных корзины

export interface IBasket{
    item: IBasketItem; // элемент товара
    total: number; // общая стоимость товаров в корзине
    quantity: number | null // количество товара в корзине
    addCard(cardId: string): void // добавление товара в корзину
    removeCard(cardId: string): void; // удаление товара из корзины
    calcTotal(): void // пересчет общей стоимости товара в корзине
}


// типизация товара на главной странице

export type CardInfo = Pick<ICard, 'category' | 'title' | 'image' | 'price'>; 

// типизация товара в модальном окне 

export type CardPrewiew = Pick<ICard, 'category' | 'title' | 'image' | 'description' | 'price'>; 

// типизация товара в корзине 

export type CardBasket = Pick<ICard, 'title' | 'price'>; 

// типизация данных пользвателя в модальном окне с выбором способа оплаты и указания адреса отправки 

export type ModalUserPaymentAndDelivery = Pick<IUser, 'payment' | 'address'>; 

// типизация данных пользвателя в модальном окне с выбором способа оплаты и указания адреса отправки 

export type ModalUserData = Pick<IUser, 'email' | 'phone'>; 

// типизация данных в модальном окне, завершающее оформление заказа

export type ModalOrder = Pick<IUser, 'total'>;