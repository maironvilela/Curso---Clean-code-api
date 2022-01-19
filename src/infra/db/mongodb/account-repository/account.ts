import { LoadAccountByEmailRepository } from '../../../../data/usecases/authentication/db-authentication.spec';
import { AccountModel } from '../../../../domain/models/account';

import {
  AddAccount,
  AddAccountModel,
} from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helpers';
import { map } from './account-mapper';

export class AccountMongoRepository
  implements AddAccount, LoadAccountByEmailRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne(accountData);
    return await map(insertedId);
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

    if (document) {
      const { _id, ...rest } = document;
      const account = { ...rest, id: _id.toHexString() } as AccountModel;
      return account;
    }

    return null;
  }
}
