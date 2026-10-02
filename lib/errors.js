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

export class ValidationError extends AppError {
  constructor(message = 'Dados de entrada inválidos.', erros = {}) {
    super(message, 400);
    this.name = 'ValidationError';
    this.erros = erros;
  }
}

/**
 * Trata erros de forma padronizada em rotas API do Next.js.
 * Retorna status 400 com lista de detalhes se for ValidationError,
 * ou o status correspondente do AppError (ex: 404, 409).
 */
export function tratarErroApi(error, mensagemPadrao = 'Erro interno do servidor.') {
  const status = error instanceof AppError ? error.statusCode : 500;
  const resposta = {
    erro: error.message || mensagemPadrao,
  };
  if (error?.erros && Object.keys(error.erros).length > 0) {
    resposta.detalhes = error.erros;
  }
  return Response.json(resposta, { status });
}

