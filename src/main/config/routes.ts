import { Express, Router } from 'express';
import fg from 'fast-glob';

/**
  @description Função de composição das configurações do express. Define a rota raiz da api
               importando os arquivos de definição de rotas passando o router como parâmetro
  @version development
  @param app (Instância do express)
*/
export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  // Retorna todos os paths dos arquivos de rotas
  fg.sync('**/src/main/routes/**/index.ts').map(async file =>
    // importa os arquivos de rota passando o router como parâmetro
    (await import(`../../../${file}`)).default(router),
  );
};
