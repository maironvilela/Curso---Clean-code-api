/**
@summary Variáveis de configurações com composições das variáveis de ambiente
@version development
*/
export default {
  mongoUrl:
    process.env.MONGO_URL ?? 'mongodb://admin:123@localhost:27017/admin',
};
