import { hash } from 'bcrypt';
import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helpers';
import app from '../../config/app';

let accountCollection: Collection;

describe('Login Router', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URL ?? '';
    await MongoHelper.connect(uri);
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test('should success router signup', async () => {
    const password = await hash('123', 12);
    await accountCollection.insertOne({
      name: 'Meg',
      email: 'meg@gmail.com',
      password,
    });
    const response = await request(app).post('/api/login').send({
      email: 'meg@gmail.com',
      password: '123',
    });
    expect(response.statusCode).toEqual(200);
  });

  test('should code 401 if password invalid', async () => {
    const password = await hash('123', 12);
    await accountCollection.insertOne({
      name: 'Meg',
      email: 'meg@gmail.com',
      password,
    });

    const response = await request(app).post('/api/login').send({
      email: 'meg@gmail.com',
      password: 'invalid_password',
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  test('should code 401 if email invalid', async () => {
    const password = await hash('123', 12);
    await accountCollection.insertOne({
      name: 'Meg',
      email: 'meg@gmail.com',
      password,
    });
    const response = await request(app).post('/api/login').send({
      email: 'invalid@gmail.com',
      password,
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('Should check if accessToken was add in case success', async () => {
    const password = await hash('123', 12);
    const { insertedId: _id } = await accountCollection.insertOne({
      name: 'Meg',
      email: 'meg@gmail.com',
      password,
    });
    const response = await request(app).post('/api/login').send({
      email: 'meg@gmail.com',
      password: '123',
    });

    const account = await accountCollection.findOne({ _id });

    expect(response.statusCode).toEqual(200);
    expect(account).toHaveProperty('access_token');
  });
});
