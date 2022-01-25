import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';

import {
  AddAccount,
  AddAccountModel,
} from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helpers';
import { mapByDocument, mapById } from './account-mapper';

/**
@description Classe que utiliza o MongoDB para realizar a persistências das informações.
@version development
@implements AddAccount
@implements LoadAccountByEmailRepository
*/
export class AccountMongoRepository
  implements
    AddAccount,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async update(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          access_token: token,
        },
      },
    );
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne(accountData);
    return await mapById(insertedId);
  }

  async load(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const document = await accountCollection.findOne(
      {
        email,
      },
      {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          password: 1,
        },
      },
    );

    if (!document) {
      return null;
    }
    return mapByDocument(document);
  }
}
