import {AxiosPromise} from 'axios';
import request from '../utils/request';

class Resource {
  uri: string = '';
  constructor(uri: string) {
    this.uri = uri;
  }
  list(query: object | undefined = undefined): AxiosPromise<any> {
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: query,
    });
  }
  get(id: string): AxiosPromise<any> {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'get',
    });
  }
  store(resource: object): AxiosPromise<any> {
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: resource,
    });
  }
  update(id: string, resource: object): AxiosPromise<any> {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'put',
      data: resource,
    });
  }
  destroy(id: string): AxiosPromise<any> {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'delete',
    });
  }
}

export default Resource;
