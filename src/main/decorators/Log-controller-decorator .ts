import {
  Controllers,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

/* A classe deve implementar a mesma interface da classe que será "decorada" */
export class LogControllerDecorator implements Controllers {
  /* Recebe como parâmetro do construtor o controller que deseja adicionar funcionalidade */
  constructor(private readonly controller: Controllers) {}
  /* Função implementada da interface */
  async handle(request: HttpRequest): Promise<HttpResponse> {
    /* Chama a função handle do controlador que será decorado e recebe o retorno da função
      A nova funcionalidade pode ser executada antes ou depois de chamar a função da
      classe que será decorada */
    const httpResponse = await this.controller.handle(request);

    return httpResponse;
  }
}
