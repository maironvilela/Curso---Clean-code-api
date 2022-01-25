import { LogRepository } from '../../../../data/protocols/db/log/log-repository';
import { MongoHelper } from '../helpers/mongo-helpers';

/**
@description Implementação da interface LogRepository para persistência do log de Erro no MongoDB
@version  development
*/
export class LogErrorMongoRepository implements LogRepository {
  async log(stack: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('errors');
    await accountCollection.insertOne({ error: stack });
  }
}
