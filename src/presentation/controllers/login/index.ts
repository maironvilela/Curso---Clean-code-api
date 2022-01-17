import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../error';
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

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
