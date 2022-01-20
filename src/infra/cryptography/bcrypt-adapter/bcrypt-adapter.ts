import { Hasher } from '../../../data/protocols/cryptography/hasher';
import bcrypt from 'bcrypt';
import { HashComparer } from '../../../data/protocols/cryptography/hash-comparer';
/**
@description Implementação da interface Hasher utilizando a biblioteca bcrypt
@version development
@see [bcrypt](https://www.npmjs.com/package/bcrypt)
*/
export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  /**
    @description Implementação da função compare utilizando o BCrypt
    @version development
    @param value string sem hash
    @param hashedValue string com hash
    @return true em caso de sucesso na comparação
    @return false em caso de falha na comparação
  */
  async compare(value: string, hashedValue: string): Promise<boolean> {
    const comparisonResult = await bcrypt.compare(value, hashedValue);
    return comparisonResult;
  }

  /**
    @description Implementação da função hash utilizando o BCrypt
    @version development
    @param value string que deseja aplicar o hash
     @return hash da string recebida como parâmetro
   */
  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
