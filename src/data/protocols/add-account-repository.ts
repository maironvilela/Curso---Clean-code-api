import {
  AccountModel,
  AddAccountModel,
} from '../usecases/add-account/db-add-account-protocols';

export interface AddAccountRepository {
  save: (account: AddAccountModel) => Promise<AccountModel>;
}
