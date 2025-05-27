import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppApi } from './components/services/AppApi';
import { CardsData } from './components/model/CardsData';
import { Page } from './components/view/Page';
import { ICard, IOrder, IContacts } from './types';
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

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(
	cloneTemplate(orderTemplate) as HTMLFormElement,
	events
);
const contacts = new ContactsForm(
	cloneTemplate(contactsTemplate) as HTMLFormElement,
	events
);

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

	const renderCard = card.render({
		id: item.id,
		category: item.category,
		description: item.description,
		image: item.image,
		price: item.price,
		title: item.title,
	});

	// устанавливаем статус кнопки в зависимости от того добавлена карточка в корзину или нет

	card.buttonState = basketData.cardInBasket(item);

	modal.render({
		content: renderCard,
	});
});

// добавление товара в корзину

events.on('card:basket', (item: ICard) => {
	modal.close();
	basketData.addCard(item);
	page.setBasketCounter(basketData.cards.length);
});

// открытие корзины

events.on('basket:open', () => {
	updateBasketContent();
	return modal.render({
		content: basket.render(),
	});
});

// Функция обновления содержимого корзины

function updateBasketContent() {
	basket.cards = basketData.cards.map((item, index) => {
		const cardInBasket = new Card(cloneTemplate(cardBasketTemplate), events, {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});

		cardInBasket.indexCard = (index + 1).toString();
		return cardInBasket.render({
			id: item.id,
			title: item.title,
			price: item.price,
		});
	});

	updateBasket();
}

// функция обновления содержимого корзины

function updateBasket() {
	page.setBasketCounter(basketData.cards.length);
	basket.price = basketData.total;
}

// удаление товара из корзины

events.on('card:delete', (item: ICard) => {
	basketData.removeItemFromBasket(item);

	if (modal.open) {
		updateBasketContent(); // перерисовываем содержимое
	} else {
		updateBasket(); // обновление цены и счетчика
	}
});

// Изменение полей формы заказа

events.on(
	/^order\..*:change$/,
	(data: { field: keyof IOrder; value: string }) => {
		orderData.setOrderField(data.field, data.value);
	}
);

// Изменение полей контактов

events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof IOrder; value: string }) => {
		orderData.setOrderField(data.field, data.value);
	}
);

// Обработка ошибок заказа

events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	const formIsValid = !payment && !address;
	order.valid = formIsValid;
	order.errors = payment || address || '';
});

// Обработка ошибок контактов

events.on('contactsFormErrors:change', (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	const formIsValid = !email && !phone;
	contacts.valid = formIsValid;
	contacts.errors = email || phone || '';
});

// Открытие формы заказа

events.on('order:open', () => {
	modal.close();
	modal.render({
		content: order.render({
			valid: orderData.isOrderFormValid(),
			address: '',
			payment: '',
			errors: [],
		}),
	});
	orderData.total = basketData.total;
});

// Открытие формы для заполнения данных пользователя

events.on('order:submit', () => {
	modal.close();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: orderData.validateContacts(), // валидация
			errors: [],
		}),
	});
});

// Отправлена форма заказа

events.on('contacts:submit', () => {
	modal.close();
	orderData.items = basketData.cards.map((item) => item.id);
	orderData.total = basketData.total;

	api
		.orderResult(orderData.getOrderData())
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), events, {
				onClick: () => {
					modal.close();
					events.emit('order:success', res);
				},
			});

			modal.render({
				content: success.render({
					total: basketData.total,
				}),
			});
			basketData.clearBasket();
			orderData.clearOrder();
			page.setBasketCounter(0);
			basket.price = 0;
		})
		.catch((err) => {
			console.error('Ошибка оформления заказа:', err);
		});
});

// очищаем корзину после успешного заказа

events.on('basket:cleared', () => {
	page.setBasketCounter(0);
	basket.price = 0;
	basket.cards = [];

	if (modal.open) {
		modal.close();
	}
});

// открытие модального окна

events.on('modal:open', () => {
	page.pageLocked = true;
});

// закрытие модального окна

events.on('modal:close', () => {
	page.pageLocked = false;
});
