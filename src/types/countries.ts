export interface IGetCountriesResponse {
  data: Data;
}

export interface Data {
  objects: Object[];
  meta: Meta;
}

export interface Meta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  more: boolean;
  request_id: string;
  duration: number;
}

export interface Object {
  names: Names;
  flag: Flag;
  cars: Cars;
  currencies: Currency[];
  _match: Match[];
  _meta: MetaClass;
}

export interface Match {
  path: string;
  value: string;
}

export interface MetaClass {
  lastUpdatedTimestamp: number;
}

export interface Cars {
  driving_side: DrivingSide;
}

export type DrivingSide = "left" | "right";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Flag {
  url_svg: string;
}

export interface Names {
  common: string;
  official: string;
}
