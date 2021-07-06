import {AxiosInstance} from 'axios';
import funCreateAxios from '../utils/request';
class Resource<type, newType, updateType> {
  uri: string = '';
  request: AxiosInstance;
  token: string = '';
  constructor(uri: string, sesionToken: string) {
    this.uri = uri;
    this.token = sesionToken;
    this.request = funCreateAxios(sesionToken);
  }
  list(query: object | undefined = undefined): Promise<Array<type>> {
    return this.request.get<type, Array<type>>('/' + this.uri, {params: query});
  }
  get(id: string): Promise<type> {
    return this.request.get<type, type>('/' + this.uri + '/' + id);
  }
  store(resource: newType): Promise<type> {
    return this.request.post<type, type>('/' + this.uri, resource);
  }
  update(id: string, resource: updateType): Promise<type> {
    return this.request.put<type, type>('/' + this.uri + '/' + id, resource);
  }
  destroy(id: string): Promise<type> {
    return this.request.delete<type, type>('/' + this.uri + '/' + id);
  }
}

export default Resource;
