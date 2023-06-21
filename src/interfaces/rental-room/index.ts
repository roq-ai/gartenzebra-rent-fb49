import { RentalRequestInterface } from 'interfaces/rental-request';
import { GetQueryInterface } from 'interfaces';

export interface RentalRoomInterface {
  id?: string;
  name: string;
  rental_request_id?: string;
  created_at?: any;
  updated_at?: any;

  rental_request?: RentalRequestInterface;
  _count?: {};
}

export interface RentalRoomGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  rental_request_id?: string;
}
