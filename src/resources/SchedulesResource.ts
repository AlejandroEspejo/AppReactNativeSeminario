import {IClient} from './ClientsResource';
import Resource from './Resource';
export interface ISchedule {
  _id: string;
  client_id: string;
  client: IClient;
  date: string;
  time: string;
  finished: boolean;
  reason?: string;
  result?: boolean;
  registerdate?: Date;
  __v?: any;
}

export interface INewSchedule {
  client_id: string;
  client: IClient;
  date: string;
  time: string;
  finished: boolean;
  reason?: string;
  result?: boolean;
  registerdate?: Date;
}

export interface IUpdateSchedule {
  client_id: string;
  client?: IClient;
  date?: string;
  time?: string;
  finished?: boolean;
  reason?: string;
  result?: boolean;
  registerdate?: Date;
}

export default class SchedulesResource extends Resource<
  ISchedule,
  INewSchedule,
  IUpdateSchedule
> {
  constructor(sesionToken: string) {
    super('schedules', sesionToken);
  }
}
