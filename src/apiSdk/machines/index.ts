import axios from 'axios';
import queryString from 'query-string';
import { MachineInterface, MachineGetQueryInterface } from 'interfaces/machine';
import { GetQueryInterface } from '../../interfaces';

export const getMachines = async (query?: MachineGetQueryInterface) => {
  const response = await axios.get(`/api/machines${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMachine = async (machine: MachineInterface) => {
  const response = await axios.post('/api/machines', machine);
  return response.data;
};

export const updateMachineById = async (id: string, machine: MachineInterface) => {
  const response = await axios.put(`/api/machines/${id}`, machine);
  return response.data;
};

export const getMachineById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/machines/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMachineById = async (id: string) => {
  const response = await axios.delete(`/api/machines/${id}`);
  return response.data;
};
