import { MissingParamError } from '../error/missing-param-error';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest } from '../helpers/http-helpers';

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    const fieldsRequired = ['name', 'email', 'password'];

    for (const field of fieldsRequired) {
      if (!request.body[field]) {
        console.log('TRUE');
        return badRequest(new MissingParamError(field));
      }
    }
    return {
      statusCode: 201,
      body: {},
    };
  }
}
