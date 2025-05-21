import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppApi } from './components/services/AppApi';
import { CardsData } from './components/model/CardsData';
import { Page } from './components/view/Page';
import { ICard, IUser, IOrder, IContacts } from './types';
import { Card } from './components/view/Card';
import { Modal } from './components/view/Modal';
import { BasketData } from './components/model/BasketData';
import { Basket } from './components/view/Basket';
import { OrderData } from './components/model/OrderData';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

const events = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL);

// шаблоны

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// класс данных

const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// главная страница

const page = new Page(document.body, events);

// класс представления

const basket = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// загрузка карточек с сервера

api
	.getProductList()
	.then((data) => {
		cardsData.cards = data;
		console.log(cardsData.cards);
	})
	.catch((err) => {
		console.error('Не удалось загрузить карточки:', err);
	});

// обновление каталога

events.on('cards:changed', (items: ICard[]) => {
	page.gallery = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), events, {
			onClick: () => {
				events.emit('card:selected', item);
			},
		});
		return card.render({
			id: item.id,
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// выбор карточки

events.on('card:selected', (item: ICard) => {
	cardsData.setPreview(item);
});

events.on('preview:change', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => {
			events.emit('preview:change', item);
			events.emit('card:basket', item);
			modal.close();
		},
	});

	modal.render({
		content: card.render({
			id: item.id,
			category: item.category,
			description: item.description,
			image: item.image,
			price: item.price,
			title: item.title,
		}),
	});
});

// добавление товара в корзину

events.on('card:basket', (item: ICard) => {
	basketData.addCard(item);
	modal.close();
});

// открытие корзины

events.on('basket:open', () => {
	basket.cards = basketData.cards.map((item, index) => {
		const cardInBasket = new Card(cloneTemplate(cardBasketTemplate), events, {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});

		cardInBasket.indexCard = (index + 1).toString();
		return cardInBasket.render({
			title: item.title,
			price: item.price,
		});
	});
	page.setBasketCounter(basketData.cards.length);
	basket.price = basketData.total;
	basket.updateButton = cardsData.cards;

	return modal.render({
		content: basket.render(),
	});
});

// удаление товара из корзины

events.on('card:delete', (item: ICard) => {
	basketData.removeItemFromBasket(item);
	basket.price = basketData.total;
	page.setBasketCounter(basketData.cards.length);
});

// открытие формы выбора способа оплаты и указания адреса

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// форма для заполнения email и телефона

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// изменение полей формы

events.on(
	/^order\..*:change$/,
	(data: { field: keyof IOrder; value: string }) => {
		orderData.setOrderField(data.field, data.value);
		orderData.validateOrder();
	}
);

events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof IOrder; value: string }) => {
		orderData.setOrderField(data.field, data.value);
		orderData.validateOrder();
	}
);

// обработка ошибок

events.on('orderErrors:change', (error: Partial<IOrder>) => {
	const { payment, address } = error;
	const formIsValid = !payment && !address;
	order.valid = formIsValid;
	if (!formIsValid) {
		order.errors = address;
	} else {
		order.errors = '';
	}
});

events.on('contactsErrors:change', (error: Partial<IContacts>) => {
	const { email, phone } = error;
	const formIsValid = !email && !phone;
	contacts.valid = formIsValid;
	if (!formIsValid) {
		contacts.errors = email || phone;
	} else {
		contacts.errors = '';
	}
});

// oтправлена форма заказа

events.on('contacts:submit', (userData: IUser) => {
	api
		.orderResult(userData)
		.then((data) => {
			modal.render({
				content: success.render(),
			});
			success.total = data.total;
			basketData.clearBasket();
			orderData.clearOrder();
		})
		.catch(console.error);
});

// открытие модального окна

events.on('modal:open', () => {
	page.pageLocked = true;
});

// закрытие модального окна

events.on('modal:close', () => {
	page.pageLocked = false;
});
