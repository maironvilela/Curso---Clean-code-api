import {
  HttpRequest,
  EmailValidator,
  Authentication,
  HttpResponse,
} from './login-protocols';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../helpers/http-helpers';
import { InvalidParamError, MissingParamError } from '../../error';

export class LoginController {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;
      const fieldsRequired = ['email', 'password'];

      for (const field of fieldsRequired) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.validate(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const token = await this.authentication.auth(email, password);

      if (!token) {
        return unauthorized();
      }

      return await new Promise(resolve => resolve(ok({})));
    } catch (err) {
      return internalServerError(err);
    }
  }
}
