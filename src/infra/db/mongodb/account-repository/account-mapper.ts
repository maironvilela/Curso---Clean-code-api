import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helpers';

/**
@description Função utilizaria para implementações que utilizam o MongoDB. utiliza o ID da conta do usuário
             para carregar as demais informações
@version development
@param insertedId ID do documento do mangoDB
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
export const mapById = async (insertedId: any): Promise<AccountModel> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const result = await accountCollection.findOne({
    _id: insertedId,
  });

  const account = {
    id: result?._id.toString() ?? '',
    name: result?.name,
    email: result?.email,
    password: result?.password,
  };
  return account;
};

/**
@description Função utilizaria para implementações que utilizam o MongoDB. Formata o documento retornado
             da pesquisa, por um objeto do banco de dados
@version development
@param document documento do documento do mangoDB
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
export const mapByDocument = (document: any): AccountModel => {
  const { _id, ...documentWithoutId } = document;
  const account = { ...documentWithoutId, id: _id };
  return account as AccountModel;
};
