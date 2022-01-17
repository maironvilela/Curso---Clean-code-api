import { MissingParamError } from '../../error';
import { badRequest } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../../protocols';

export class LoginController {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve =>
      resolve(badRequest(new MissingParamError('username'))),
    );
  }
}
