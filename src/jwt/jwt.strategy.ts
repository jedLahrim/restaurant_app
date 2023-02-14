import process from 'process';
import * as jwt from 'jsonwebtoken';

export class JwtStrategy {
  async authGuard(req, res) {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
      return res.status(401).json({ UnauthorizedException: 'Unauthorized' });
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    try {
      const secretKey = process.env.SECRET_KEY;
      const decoded: any = jwt.verify(bearerToken, secretKey);
      req.user = decoded;
      return decoded;
    } catch (error) {
      return res.status(401).json({ UnauthorizedException: 'Unauthorized' });
    }
  }
}
