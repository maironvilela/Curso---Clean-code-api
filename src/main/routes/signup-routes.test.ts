import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers';
import app from '../config/app';

describe('Signup router', () => {
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
  test('should success router signup', async () => {
    const response = await request(app).post('/api/signup').send({
      name: 'Jose',
      email: 'jose@email.com.br',
      password: 'password',
      passwordConfirmation: 'password',
    });
    console.log(response.statusCode);
  });
});
