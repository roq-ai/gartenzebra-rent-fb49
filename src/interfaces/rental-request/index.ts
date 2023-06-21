import { RentalRoomInterface } from 'interfaces/rental-room';
import { UserInterface } from 'interfaces/user';
import { MachineInterface } from 'interfaces/machine';
import { GetQueryInterface } from 'interfaces';

export interface RentalRequestInterface {
  id?: string;
  start_date: any;
  end_date: any;
  pickup_time: string;
  dropoff_time: string;
  customer_id?: string;
  machine_id?: string;
  created_at?: any;
  updated_at?: any;
  rental_room?: RentalRoomInterface[];
  user?: UserInterface;
  machine?: MachineInterface;
  _count?: {
    rental_room?: number;
  };
}

export interface RentalRequestGetQueryInterface extends GetQueryInterface {
  id?: string;
  pickup_time?: string;
  dropoff_time?: string;
  customer_id?: string;
  machine_id?: string;
}
