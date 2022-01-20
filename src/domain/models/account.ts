/**
@description Interface que reflete as informações da conta do usuário na base de dados
@version  development
*/
export interface AccountModel {
  id: string;
  name: string;
  email: string;
  password: string;
}
