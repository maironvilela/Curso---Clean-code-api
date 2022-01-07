import { MissingParamError } from '../error/missing-param-error';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest } from '../helpers/http-helpers';

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    if (!request.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!request.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    return {
      statusCode: 201,
      body: {},
    };
  }
}
