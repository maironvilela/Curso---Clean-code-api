/**
@description Interface que define o formato do retorno da função auth da interface Authentication
 */
export interface AuthenticationResult {
  name: string;
  token: string;
}

/**
@description Interface que define o formato das propriedades  da função auth da interface Authentication
 */
export interface AuthenticationProps {
  email: string;
  password: string;
}

/**
@description Interface que define a implementação da autenticação do usuário
@version  development
*/
export interface Authentication {
  /**
  @description Função responsável por autenticar o usuário
  @param  AuthenticationProps
  ```js
    interface AuthenticationProps {
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
  auth: (date: AuthenticationProps) => Promise<AuthenticationResult | null>;
}
