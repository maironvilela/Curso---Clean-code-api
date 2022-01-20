import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: '' as string,

  /**
    @description Realizar uma conexão com o banco de dados MongoDB
    @version development
    @param uri - uri de conexão com o MongoDB
  */
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  /**
    @description Finaliza a conexão com o MongoDB
    @version development
   */
  async disconnect(): Promise<void> {
    await this.client.close();
  },

  /**
    @description Recupera uma coleção do banco de dados MongoDB
    @version development
    @param name - nome da coleção
    @return Collection (MongoDB)
  */
  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },
};
