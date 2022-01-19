export interface AuthenticationResult {
  name: string;
  token: string;
}

export interface Authentication {
  auth: (
    email: string,
    password: string,
  ) => Promise<AuthenticationResult | null>;
}
