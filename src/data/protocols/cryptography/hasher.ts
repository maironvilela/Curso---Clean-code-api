/**
   @description Interface responsável por definir a implementação das classes
                 para realizar hash de alguma informação
   @version development
*/
export interface Hasher {
  /**
    @description Realiza o hash da informação recebida
    @version development
    @param value Informação que deseja obter o hash
    @return Promise com hash da informação recebida
  */
  hash: (value: string) => Promise<string>;
}
