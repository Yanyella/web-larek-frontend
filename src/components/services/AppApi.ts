import { ICard, IUser } from '../../types';
import { ApiListResponse } from '../base/api';
import { Api } from '../base/api';

export interface IAppApi {
	getProductList: () => Promise<ICard[]>;

	orderResult: (order: IUser) => Promise<IOrderResult>;
}

export interface IOrderResult {
	id: string;

	total: number;
}

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string) {
		super(baseUrl);

		this.cdn = cdn;
	}
	getProductList(): Promise<ICard[]> {
		return this.get(`/product`).then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,

				image: this.cdn + item.image.replace('.svg', '.png'),
			}))
		);
	}

	orderResult(order: IUser): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
