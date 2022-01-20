import { AccountMongoRepository } from './account';
import { MongoHelper } from '../helpers/mongo-helpers';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URL ?? '';
    await MongoHelper.connect(uri);
  });
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
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
  it('should load an account by email ', async () => {
    const accountMongoRepository = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    await accountMongoRepository.add(accountData);

    const account = await accountMongoRepository.load('valid_email@email.com');

    expect(account).toHaveProperty('id');
  });
  it('should return  null if email invalid ', async () => {
    const accountMongoRepository = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    await accountMongoRepository.add(accountData);

    const account = await accountMongoRepository.load(
      'invalid_email@email.com',
    );
    expect(account).toBeNull();
  });
});
