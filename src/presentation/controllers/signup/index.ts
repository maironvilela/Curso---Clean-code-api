import {
  badRequest,
  internalServerError,
  create,
} from '../../helpers/http-helpers';
import { Validation } from '../../protocols/Validation';

import {
  AddAccount,
  Controllers,
  HttpRequest,
  HttpResponse,
} from './signup-protocols';

export class SignUpController implements Controllers {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = request.body;
      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
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
