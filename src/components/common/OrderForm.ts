import { IOrder, TPayment } from "../../types";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";

// класс представления формы заказа

export class OrderForm extends Form<IOrder> {

   private _paymentButtons: Record<TPayment, HTMLButtonElement>; // способы оплаты
   private _activePayment: TPayment = 'card'; // дефолтное значение оплаты

   constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      
      this._paymentButtons = {
        cash: ensureElement<HTMLButtonElement>('button[name="cash"]', this.container),
        card: ensureElement<HTMLButtonElement>('button[name="card"]', this.container)
      }

      this.setupPaymentButtons();

      this.setPaymentMethod('card');
    
    }

    // метод клика на кнопки 

    private setupPaymentButtons(): void {
        Object.entries(this._paymentButtons).forEach(([method, button]) => {
            button.addEventListener('click', () => {
                this.setPaymentMethod(method as TPayment); // сохранение способа оплаты
                this.onInputChange('payment', method);
            });
        });
    }

    // метод способа оплаты 
    
    private setPaymentMethod(method: TPayment): void {
        this._activePayment = method;
        Object.entries(this._paymentButtons).forEach(([key, button]) => {
            button.classList.toggle('button_alt-active', key === method);
        });
    }

    // получение способа оплаты 

    get paymentMethod(): TPayment {
        return this._activePayment;
    }

    // сохранение адреса 

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}