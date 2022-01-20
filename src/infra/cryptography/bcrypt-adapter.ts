import { Hasher } from '../../data/protocols/cryptography/hasher';
import bcrypt from 'bcrypt';
/**
@description Implementação da interface Hasher utilizando a biblioteca bcrypt
@version development
@see [bcrypt](https://www.npmjs.com/package/bcrypt)
*/
export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}
  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
