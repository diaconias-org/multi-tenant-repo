/**
 * lib/errors.js
 * Erros customizados da aplicação para padronizar respostas e status HTTP.
 */
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}
