import { Request, Response } from 'express';
import { Controllers, HttpRequest } from '../../../presentation/protocols';

/**
  @description Função utilizada para adaptar o controller utilizada pelas requisições do express
               para o controller da aplicação. A função retornada é um middleware do express. Recebe as informação
               das requisições recebendo o request e response e chamando a função handle do controlador que tratara
               as informações da requisição
  @version development
  @param controller
  @return retorna um middleware adequado para receber as requisições do express
 */
export const expressRouterAdapter = (controller: Controllers) => {
  return async (req: Request, resp: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };
    // Chama a função handle do controlador, recebendo o response
    const httpResponse = await controller.handle(httpRequest);

    // Adiciona o status e o corpo do response do controlador na response do express

    if (httpResponse.statusCode === 201 || httpResponse.statusCode === 200) {
      resp.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      resp
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.body.message });
    }
  };
};
