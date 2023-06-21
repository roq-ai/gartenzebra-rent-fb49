import axios from 'axios';
import queryString from 'query-string';
import { RentalRequestInterface, RentalRequestGetQueryInterface } from 'interfaces/rental-request';
import { GetQueryInterface } from '../../interfaces';

export const getRentalRequests = async (query?: RentalRequestGetQueryInterface) => {
  const response = await axios.get(`/api/rental-requests${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRentalRequest = async (rentalRequest: RentalRequestInterface) => {
  const response = await axios.post('/api/rental-requests', rentalRequest);
  return response.data;
};

export const updateRentalRequestById = async (id: string, rentalRequest: RentalRequestInterface) => {
  const response = await axios.put(`/api/rental-requests/${id}`, rentalRequest);
  return response.data;
};

export const getRentalRequestById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rental-requests/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRentalRequestById = async (id: string) => {
  const response = await axios.delete(`/api/rental-requests/${id}`);
  return response.data;
};
