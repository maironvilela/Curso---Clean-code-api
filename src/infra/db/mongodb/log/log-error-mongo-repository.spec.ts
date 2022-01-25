import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helpers';
import { LogErrorMongoRepository } from './log-error-mongo-repository';

let errorCollection: Collection;

describe('Log Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  it('should create an error log', async () => {
    const sut = new LogErrorMongoRepository();

    await sut.log('any_error');

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
