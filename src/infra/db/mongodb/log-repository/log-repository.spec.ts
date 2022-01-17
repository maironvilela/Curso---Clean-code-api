import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helpers';
import { LogMongoRepository } from './log-error';

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
    const sut = new LogMongoRepository();

    await sut.log('any_error');

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
