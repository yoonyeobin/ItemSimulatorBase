import express from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 3. 캐릭터 생성
router.post('/character/create', authMiddleware, async (req, res) => {});

// [필수] 4. 캐릭터 삭제
router.delete('/character/delete', authMiddleware, async (req, res) => {});

// [필수] 5. 캐릭터 상세 조회
router.get('/character/detail', async (req, res) => {});

export default router;
