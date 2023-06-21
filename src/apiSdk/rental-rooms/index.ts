import axios from 'axios';
import queryString from 'query-string';
import { RentalRoomInterface, RentalRoomGetQueryInterface } from 'interfaces/rental-room';
import { GetQueryInterface } from '../../interfaces';

export const getRentalRooms = async (query?: RentalRoomGetQueryInterface) => {
  const response = await axios.get(`/api/rental-rooms${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRentalRoom = async (rentalRoom: RentalRoomInterface) => {
  const response = await axios.post('/api/rental-rooms', rentalRoom);
  return response.data;
};

export const updateRentalRoomById = async (id: string, rentalRoom: RentalRoomInterface) => {
  const response = await axios.put(`/api/rental-rooms/${id}`, rentalRoom);
  return response.data;
};

export const getRentalRoomById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rental-rooms/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRentalRoomById = async (id: string) => {
  const response = await axios.delete(`/api/rental-rooms/${id}`);
  return response.data;
};
