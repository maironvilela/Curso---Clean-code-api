import { Express } from 'express';
import { bodyParser, cors, contentType } from '../middleware';

/**
  @description Função que adiciona middleware na configuração do express
  @version development
  @param app (Instância do express)
*/
export default (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};
