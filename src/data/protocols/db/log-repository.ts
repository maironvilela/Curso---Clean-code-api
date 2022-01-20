/**
@description Interface que define a implementação de logs
@version  development
*/
export interface LogRepository {
  /**
    @description Salva o stack do erro
    @version development
    @param stack Stack do erro que deverá ser salva
  */
  log: (stack: string) => Promise<void>;
}
