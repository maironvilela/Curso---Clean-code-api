import {
  AccountModel,
  AddAccountModel,
} from '../../usecases/add-account/db-add-account-protocols';

/**
@description Interface que define a implementação das classes responsáveis
         por salvar uma conta do usuário
@version development
*/
export interface AddAccountRepository {
  /**
 @description Função responsável por salvar uma conta do usuário em uma base de dados
  @version development
  @param AddAccountModel
    ```js
    interface AddAccountModel {
      name: string;
      email: string;
      password: string;
    }
    *```
  @return
  ```js
    interface AccountModel {
      id: string;
      name: string;
      email: string;
      password: string;
    }
    *```
   */

  add: (account: AddAccountModel) => Promise<AccountModel>;
}
