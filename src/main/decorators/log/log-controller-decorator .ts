import {
  Controllers,
  HttpRequest,
  HttpResponse,
} from '../../../presentation/protocols';
import { LogError } from './log-controller-decorator.spec';

/* A classe deve implementar a mesma interface da classe que será "decorada" */
export class LogControllerDecorator implements Controllers {
  /* Recebe como parâmetro do construtor o controller que deseja adicionar funcionalidade */
  constructor(
    private readonly controller: Controllers,
    private readonly logError: LogError,
  ) {}

  /* Função implementada da interface */
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    /* Chama a função handle do controlador que será decorado e recebe o retorno da função
      A nova funcionalidade pode ser executada antes ou depois de chamar a função da
      classe que será decorada */
    // const httpResponse = await this.controller.handle(request);

    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      console.log(httpResponse.body.stack);
      await this.logError.log(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
