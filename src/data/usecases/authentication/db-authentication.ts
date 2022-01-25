import {
  Authentication,
  AuthenticationProps,
  AuthenticationResult,
} from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/cryptography/hash-comparer';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository';

/**
@description Implementação da interface de regra de negocio Authentication.
@version  development
@constructor LoadAccountByEmailRepository: Adiciona a funcionalidade de buscar uma conta de usuário
             através do email
@constructor HashComparer: Adiciona a funcionalidade de comparar a senha recebida com a senha carregada
             do banco de dados.
@constructor TokenGenerator: Adiciona a funcionalidade de gerar um token para a sessão do usuário
@constructor UpdateAccessTokenRepository: Adiciona a funcionalidade de atualizar o token do usuário
             na base de dados
*/
export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashedCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  /**
    @description Função responsável por validar o login do usuário
    @version development
    @param AuthenticationProps
    ```js
      Interface AuthenticationProps {
        email: string;
        password: string;
      }
    ```
    @return
    ```js
      interface AuthenticationResult {
        name: string;
        token: string;
      }
    ```
    */
  async auth({
    email,
    password,
  }: AuthenticationProps): Promise<AuthenticationResult | null> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (account) {
      const isValidPassword = await this.hashedCompare.compare(
        password,
        account.password,
      );
      if (isValidPassword) {
        const token = await this.tokenGenerator.generate(account.id, 'secret');
        await this.updateAccessTokenRepository.update(account.id, token);
        return { name: account.name, token };
      }
    }

    return null;
  }
}
