import { Request, Response } from 'express';
import { Controllers, HttpRequest } from '../../presentation/protocols';

/* Recebe como parâmetro o controller que se deseja adapta */
export const expressRouterAdapter = (controller: Controllers) => {
  /* A função retornada é um middleware do express. Recebe as informação das requisições
    recebendo o request e response e chamando a função handle do controlador que tratara
    as informações da requisição
  */
  return async (req: Request, resp: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };
    // Chama a função handle do controlador, recebendo o response
    const httpResponse = await controller.handle(httpRequest);

    // Adiciona o status e o corpo do response do controlador na response do express
    resp.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
