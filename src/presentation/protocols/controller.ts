import { HttpRequest, HttpResponse } from './http';

export interface controllers {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}
