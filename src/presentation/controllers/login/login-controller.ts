import {
  HttpRequest,
  Authentication,
  HttpResponse,
} from './login-controller-protocols';

import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../helpers/http-helpers';
import { Validation } from '../../protocols/Validation';

export class LoginController {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;

      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }

      const authenticationResult = await this.authentication.auth({
        email,
        password,
      });

      if (!authenticationResult) {
        return unauthorized();
      }

      return ok(authenticationResult);
    } catch (err) {
      return internalServerError(err);
    }
  }
}
