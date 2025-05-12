import { ICard, IUser, IUserResponce } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export interface IAppApi {
	getCardList: () => Promise<ICard[]>;
	orderUserResult: (order: IUser) => Promise<IUserResponce>;
}

export class AppApi extends Api implements IAppApi{
	readonly cdn: string;

  	constructor( baseUrl: string, cdn: string) {
    super(baseUrl);
    this.cdn = cdn;
  }

	getCardList(): Promise<ICard[]> {
		return this.get(`/product`).then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image.replace(".svg", ".png"),
			}))
		);
	}

	orderUserResult(order: IUser): Promise<IUserResponce> {
		return this.post(`/order`, order).then((data: IUserResponce) => data);
	}
}