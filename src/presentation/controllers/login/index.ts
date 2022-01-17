import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../error';
import {
  badRequest,
  internalServerError,
  ok,
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

      if (!email) {
        return await new Promise(resolve =>
          resolve(badRequest(new MissingParamError('email'))),
        );
      }

      if (!password) {
        return await new Promise(resolve =>
          resolve(badRequest(new MissingParamError('password'))),
        );
      }

      const isValidEmail = this.emailValidator.validate(email);

      if (!isValidEmail) {
        return await new Promise(resolve =>
          resolve(badRequest(new InvalidParamError('email'))),
        );
      }

      await this.authentication.auth(email, password);

      return await new Promise(resolve => resolve(ok({})));
    } catch (err) {
      return internalServerError(err);
    }
  }
}
