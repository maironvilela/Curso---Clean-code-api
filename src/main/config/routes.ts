//  fg.sync('**/src/main/routes/**routes.ts'):
// await import(`../../../${file}`)).default(router):

import { Express, Router } from 'express';
import fg from 'fast-glob';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  // Retorna todos os paths dos arquivos de rotas
  fg.sync('**/src/main/routes/**/index.ts').map(async file =>
    // importa os arquivos de rota passando o router como parâmetro
    (await import(`../../../${file}`)).default(router),
  );
};
