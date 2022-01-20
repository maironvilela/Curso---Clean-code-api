import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator';
import jwt from 'jsonwebtoken';
export class JWTAdapter implements TokenGenerator {
  async generate(plaintext: string, secret: string): Promise<string> {
    const token = jwt.sign({ id: plaintext }, secret);
    return token;
  }
}
