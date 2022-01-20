import { LogRepository } from '../../../data/protocols/db/log-repository';
import {
  Controllers,
  HttpRequest,
  HttpResponse,
} from '../../../presentation/protocols';

/* A classe deve implementar a mesma interface da classe que será "decorada" */
/**
  @description Classe que implementa a interface Controllers utilizada para adicionar
               a funcionalidade de log no controller
  @version development
  @constructor Controllers (Controller que será decorado)
  @constructor logError (Instância da interface LogRepository, que salva o log no base de dados)
*/
export class LogControllerDecorator implements Controllers {
  /* Recebe como parâmetro do construtor o controller que deseja adicionar funcionalidade */
  constructor(
    private readonly controller: Controllers,
    private readonly logError: LogRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    /* Chama a função handle do controlador que será decorado e recebe o retorno da função
      A nova funcionalidade pode ser executada antes ou depois de chamar a função da
      classe que será decorada */
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      await this.logError.log(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
