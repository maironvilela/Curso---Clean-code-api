import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
} from './db-add-account-protocols';

/**
@description Implementação da interface da regra de negocio AddAccount. Responsável por gerenciar a
         persistência da conta do usuário na base de dados
@version  development
@constructors Hasher: Adiciona a função de criar o hash da senha para ser salva no banco de dados
@constructor AddAccountRepository: Implementação da interface AddAccountRepository. Adiciona a função
             de salvar a conta do usuário no banco de dados
*/
export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  /**
    @description Função que adiciona a conta do usuário
    @version development
    @param accountData
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
    ```

  */
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return account;
  }
}
