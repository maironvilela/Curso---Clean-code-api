import { LogErrorRepository } from '../../../../data/protocols/db/log-error-repository';
import { MongoHelper } from '../helpers/mongo-helpers';

export class LogMongoRepository implements LogErrorRepository {
  async log(stack: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('errors');
    await accountCollection.insertOne({ error: stack });
  }
}
