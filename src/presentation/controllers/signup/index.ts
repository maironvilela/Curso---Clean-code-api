import { MissingParamError, InvalidParamError } from '../../error';
import {
  badRequest,
  internalServerError,
  create,
} from '../../helpers/http-helpers';
import { Validation } from '../../protocols/Validation';

import {
  AddAccount,
  Controllers,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from './signup-protocols';

export class SignUpController implements Controllers {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password, passwordConfirmation } = request.body;
      const fieldsRequired = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of fieldsRequired) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isEmailValid = this.emailValidator.validate(email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      return create(account);
    } catch (err) {
      return internalServerError(err);
    }
  }
}
