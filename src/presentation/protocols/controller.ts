import { HttpRequest, HttpResponse } from './http';

export interface Controllers {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}
