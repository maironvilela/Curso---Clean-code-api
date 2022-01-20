export interface TokenGenerator {
  generate: (id: string, secret: string) => Promise<string>;
}
