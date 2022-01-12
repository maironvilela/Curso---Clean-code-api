import { AddAccount } from '../../../../domain/usecases/add-account';
import { AccountMongoRepository } from './account';
import { MongoHelper } from '../helpers/mongo-helpers';

const makeSut = (): AddAccount => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URL ?? '';
    await MongoHelper.connect(uri);
  });
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should save account ', async () => {
    const accountMongoRepository = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    const account = await accountMongoRepository.add(accountData);

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('valid_name');
    expect(account.email).toBe('valid_email@email.com');
    expect(account.password).toBe('valid_password');
  });
});
