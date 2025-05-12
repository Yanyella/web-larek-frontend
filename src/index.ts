import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppApi } from './components/common/AppApi';
import { CardsData } from './components/common/CardsData';
import { Page } from './components/common/Page';
import { ICard, ICardsList } from './types';
import { Card } from './components/common/Card';
import { Modal } from './components/common/Modal';
import { IEvents } from './components/base/events';
import { BasketData } from './components/common/BasketData';

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

const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// загрузка карточек с сервера

api.getCardList()
  .then((data) => {
    cardsData.cards = data;
    console.log(cardsData.cards);
    events.emit('cards:loaded'); 
  })  
  .catch((err) => {
    console.error('Не удалось загрузить карточки:', err);
    events.emit('cards:load-error', err);
});

// обновление каталога товаров

events.on('cards:changed', (items: ICard[]) => {
  page.gallery = items.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), events);
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    });
  });
});

// выбор карточки

events.on('card:selected', (item: ICard) => {
    cardsData.setCardPreview(item.id); 
    events.emit('preview:open', item); 
});

function createPreviewCard(item: ICard) {
    const card = new Card(cloneTemplate(cardPreviewTemplate), events, {
        onClick: () => { 
            events.emit('card:basket', item);
            modal.close();
        },
    });
    
    return card.render({
        title: item.title,
        description: item.description,
        category: item.category,
        image: item.image,
        price: item.price,
        cardButton: basketData.getButtonStatus(item)
    });
}

events.on('preview:open', (item: ICard) => {
    if (modal) { 
        modal.render({
            content: createPreviewCard(item)
        });
        modal.open(); 
    }
});

events.on('modal:open', () => {
	page.pageLocked = true;
});

events.on('modal:close', () => {
	page.pageLocked = false;
});