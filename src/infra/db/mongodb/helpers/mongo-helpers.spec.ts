import { MongoHelper as sut } from './mongo-helpers';

describe('Mongo Helpers', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await sut.disconnect();
  });
  it('should reconnect if mongodb is down', async () => {
    await sut.disconnect();
    const accountConnection = sut.getCollection('accounts');
    expect(accountConnection).not.toEqual(null);
  });
});
