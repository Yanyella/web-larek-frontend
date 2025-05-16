import { ISuccess } from "../../types";
import { IEvents } from "../base/events";

// класс данных завершения заказа 

export class SuccessData implements ISuccess {
    protected _total: number; // окончательнная стоимости заказа
    protected events: IEvents;

    constructor(events: IEvents) {
        this._total = 0; // дефолтное значение
        this.events = events;
    }
    
    // поолучение стоимости заказа 

    get total(): number {
        return this._total;
    }

    // сохранение стоимости заказа 
    
    set total(value: number) {
        this._total = value;
        this.events.emit('success:total-changed');
    }
}