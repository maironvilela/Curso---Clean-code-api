import { InvalidParamError, MissingParamError } from '../../error';
import { badRequest, ok } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController {
  constructor(private readonly emailValidator: EmailValidator) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
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

    return await new Promise(resolve => resolve(ok({})));
  }
}
