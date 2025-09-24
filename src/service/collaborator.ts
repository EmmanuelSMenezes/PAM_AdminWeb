import { ICollaboratorCreate, ICollaboratorListResponse, ICollaboratorResponse, ICollaboratorUpdate, ICollaboratorUpdateResponse, IPaginationList } from 'src/@types/collaborator';
import { api } from './api';

export const collaboratorCreate = async (collaborator: ICollaboratorCreate): Promise <ICollaboratorResponse> => {
  const response = await api.post('/collaborator/create', collaborator);
  return response.data.data;
}

export const collaboratorList = async ({sponsor_id, itensPerPage, page, filter}: IPaginationList): Promise<ICollaboratorListResponse> => {
  const params = new URLSearchParams();
  params.set('sponsor_id', String(sponsor_id));
  params.set('filter', String(filter));
  params.set('page', String(page + 1));
  params.set('itensPerPage', String(itensPerPage));
  const response = await api.get(`/collaborator/list/`, {params});
  return response.data.data;
}

export const collaboratorUpdate = async (data: ICollaboratorUpdate[]): Promise<ICollaboratorUpdateResponse> => {
  const response = await api.put('/collaborator/update', data);
  return response.data.data;
};

export const collaboratorDelete = async (id: string[]): Promise<ICollaboratorUpdateResponse> => {
  const response = await api.delete('/collaborator/delete',  { data: id });
  return response.data.data;
};

