export interface EmailValidator {
  /**
   * @description Função que realiza a validação de email
   * @param email email que precisa ser validado
   * @returns retorna true se o email for válido e false caso for inválido
   * @Example validate(email)
   */
  validate: (email: string) => boolean;
}
