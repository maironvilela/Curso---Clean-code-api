import { AccountModel } from '../../../../domain/models/account';
import { InvalidSearchError } from '../../../errors';
import { MongoHelper } from '../helpers/mongo-helpers';

export const map = async (insertedId: any): Promise<AccountModel> => {
  const accountCollection = await MongoHelper.getCollection('accounts');
  const result = await accountCollection.findOne({
    _id: insertedId,
  });

  if (!result) {
    throw new InvalidSearchError(insertedId.toString());
  }

  const account = {
    id: result._id.toString() ?? '',
    name: result.name,
    email: result.email,
    password: result.password,
  };

  return account;
};
