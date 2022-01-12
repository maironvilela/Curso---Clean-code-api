import { AccountModel } from '../../../../domain/models/account';

import {
  AddAccount,
  AddAccountModel,
} from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helpers';
import { map } from './account-mapper';

export class AccountMongoRepository implements AddAccount {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne(accountData);
    return await map(insertedId);
  }
}
