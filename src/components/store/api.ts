import request from '../../utils/request';

export async function getStoreList(params?: { name?: string }) {
  return request.get('/api/store/list', { params });
}

export async function createStore(data: {
  name: string;
  code: string;
  locationName?: string;
}) {
  return request.post('/api/store/create', data);
}

export async function updateStore(
  id: number,
  data: {
    name: string;
    code: string;
    locationName?: string;
  }
) {
  return request.put(`/api/store/${id}`, data);
}

export async function getStoreHours(storeId: number) {
  return request.get(`/api/store/${storeId}/hours`);
}