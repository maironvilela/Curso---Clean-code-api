import { AccountModel } from '../models/account';

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

/**
@description Interface que define a implementação que se deve seguir para adicionar uma conta do usuário na base de dados
@version  development
*/
export interface AddAccount {
  /**
   * @description Função responsável por adicionar uma conta de usuário na base de dados
   * @version development
   * @param account
   * ```js
   * interface AddAccountModel{
   *   name: string;
   *   email: string;
   *   password: string;
    }
   * ```
   * @return
   * ```js
   * interface AddAccountModel{
   *    name: string;
   *    email: string;
   *    password: string;
    }
   * ```

  */
  add: (account: AddAccountModel) => Promise<AccountModel>;
}
