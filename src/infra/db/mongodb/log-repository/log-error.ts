import { LogError } from '../../../../main/decorators/log/log-controller-decorator.spec';
import { MongoHelper } from '../helpers/mongo-helpers';

export class LogMongoRepository implements LogError {
  async log(stack: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('errors');
    await accountCollection.insertOne({ error: stack });
  }
}
