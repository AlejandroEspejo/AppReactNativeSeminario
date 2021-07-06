import {API_URL} from '../utils/config';
import Resource from './Resource';
export interface IClient {
  _id: string;
  first_name: string;
  last_name: string;
  telf?: string;
  uri_photo?: string;
  path_photo?: string;
  in_route?: boolean;
  registerdate?: Date;
  email?: string;
  probability_client?: number;
  loc_lat?: number;
  loc_long?: number;
  regularclient?: boolean;
  zona?: string;
  calle?: string;
  tipocliente?: string;
}

export interface INewClient {
  first_name: string;
  last_name: string;
  telf?: string;
  uri_photo?: string;
  path_photo?: string;
  in_route?: boolean;
  registerdate?: Date;
  email?: string;
  probability_client?: number;
  loc_lat?: number;
  loc_long?: number;
  regularclient?: boolean;
  zona?: string;
  calle?: string;
  tipocliente?: string;
}

export interface IUpdateClient {
  first_name?: string;
  last_name?: string;
  telf?: string;
  in_route?: boolean;
  registerdate?: Date;
  email?: string;
  probability_client?: number;
  loc_lat?: number;
  loc_long?: number;
  regularclient?: boolean;
  zona?: string;
  calle?: string;
  tipocliente?: string;
}

export default class ClientsResource extends Resource<
  IClient,
  INewClient,
  IUpdateClient
> {
  constructor(sesionToken: string) {
    super('clients', sesionToken);
  }
  sendClientPhoto(clientId: string, uriImage: string): Promise<any> {
    var data = new FormData();
    data.append('avatar', {
      name: 'avatar.jpg',
      uri: uriImage,
      type: 'image/jpg',
    });
    return fetch(API_URL + '/uploadclientphoto/' + clientId, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: this.token,
      },
      body: data,
    }).then(result => {
      result.json();
    });
  }
}
