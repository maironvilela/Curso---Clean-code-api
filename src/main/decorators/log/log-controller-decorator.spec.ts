import { LogErrorRepository } from '../../../data/protocols/db/log-error-repository';
import { ServerError } from '../../../presentation/error';
import { internalServerError } from '../../../presentation/helpers/http-helpers';
import {
  Controllers,
  HttpRequest,
  HttpResponse,
} from '../../../presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator ';

interface makeSutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controllers;
  logErrorStub: LogErrorRepository;
}

const makeLogErrorStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controllers => {
  class ControllerStub implements Controllers {
    async handle(request: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 0,
        body: {
          name: 'return_name',
          email: 'return_email@email.com',
          password: 'return_password',
          const: 'return_password',
        },
      };
      return await new Promise(resolve => resolve(httpResponse));
    }
  }

  return new ControllerStub();
};

const makeSut = (): makeSutTypes => {
  const logErrorStub = makeLogErrorStub();
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub, logErrorStub);

  return { controllerStub, sut, logErrorStub };
};

describe('Log Controller Decorator', () => {
  it('should call the controller handle function passed as a parameter', async () => {
    const { sut, controllerStub } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
  it('should return the same result as controller', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };

    const response = await sut.handle(httpRequest);

    expect(response).toEqual({
      statusCode: 0,
      body: {
        name: 'return_name',
        email: 'return_email@email.com',
        password: 'return_password',
        const: 'return_password',
      },
    });
  });
  it('should call the log function with the correct parameters if error 500 occurs in the controller', async () => {
    const { sut, controllerStub, logErrorStub } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        confirmPassword: 'any_password',
      },
    };
    const fakeError = new ServerError('any_stack');
    const serverError = internalServerError(fakeError);

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
      return await new Promise(resolve => resolve(serverError));
    });
    const logErrorSpy = jest.spyOn(logErrorStub, 'log');

    await sut.handle(httpRequest);

    expect(logErrorSpy).toHaveBeenCalledWith('any_stack');
  });
});
