import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing.' });
    }

    const tokenInfo = authHeader.split(' ');
    if (tokenInfo.length !== 2) {
      return res.status(400).json({ error: '잘못된 인증 정보입니다.' });
    }

    if (tokenInfo[0] !== 'Bearer') {
      return res.status(400).json({ error: '잘못된 토큰 타입입니다.' });
    }

    const token = tokenInfo[1];
    const decodeToken = jwt.verify(token, 'secretOrPrivateKey');
    const accountId = decodeToken.accountId;

    const accountInfo = await prisma.account.findUnique({
      where: { accountId: accountId },
      select: { accountId: true, password: false, userName: true },
    });
    if (accountInfo == null) {
      return res.status(400).json({ error: '계정 정보를 찾을 수 없습니다.' });
    }

    // Pass the accountInfo to the request object
    req.accountInfo = accountInfo;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: '서버에 오류가 있습니다.' });
  }
};

export default authMiddleware;
