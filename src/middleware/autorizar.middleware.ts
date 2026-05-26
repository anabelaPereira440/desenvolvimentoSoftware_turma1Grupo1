import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function autorizar(rolesPermitidos: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Não autenticado.' });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        erro: 'Acesso negado: permissões insuficientes.'
      });
    }

    next();
  };
}