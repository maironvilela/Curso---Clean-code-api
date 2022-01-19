import {
  Authentication,
  AuthenticationResult,
} from '../../../domain/usecases/authentication';
import {
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository,
} from './db-authentication.spec';

export class DBAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashedCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepositoryStub: UpdateAccessTokenRepository,
  ) {}

  async auth(
    email: string,
    password: string,
  ): Promise<AuthenticationResult | null> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (account) {
      const isValidPassword = await this.hashedCompare.compare(
        password,
        account.password,
      );
      if (isValidPassword) {
        const token = this.tokenGenerator.generate();
        // Atualizar o token no banco de dados
        await this.updateAccessTokenRepositoryStub.update(account.id, token);

        return { name: account.name, token };
      }
    }

    return null;
  }
}
