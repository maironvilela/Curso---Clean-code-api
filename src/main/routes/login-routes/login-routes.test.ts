import request from 'supertest';
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helpers';
import app from '../../config/app';

describe('Login Router', () => {
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
  test('should success router signup', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'jose@email.com.br',
      password: 'password',
    });
    expect(response.statusCode).toEqual(203);
  });
});
