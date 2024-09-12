import express from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 3. 캐릭터 생성
router.post('/character/create', authMiddleware, async (req, res) => {
  try {
    const characterName = req.body.characterName;

    const existAccount = await prisma.character.findUnique({
      where: { characterName: characterName },
    });

    if (existAccount) {
      return res.status(404).json({ error: '중복되는 이름입니다.' });
    }

    const createCharacter = await prisma.character.create({
      data: {
        characterName: characterName,
        health: 500,
        power: 100,
        money: 10000,
      },
    });

    return res.status(200).json({ characterID: createCharacter.characterId });
  } catch (err) {
    res.status(500).json({ error: '캐릭터 생성에 실패했어요.' });
    console.log(err);
  }
});

// [필수] 4. 캐릭터 삭제
router.delete('/character/delete/:characterId', authMiddleware, async (req, res) => {
  try {
    const { characterId } = req.params;

    await prisma.character.delete({
      where: { characterId: +characterId },
    });

    return res.status(200).json({ data: '캐릭터가 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '캐릭터 삭제에 실패했어요.' });
    console.log(err);
  }
});

// [필수] 5. 캐릭터 상세 조회
router.get('/character/detail/:characterId', authMiddleware, async (req, res) => {
  try {
    const { characterId } = req.params;

    const findCharacter = await prisma.character.findUnique({
      where: { characterId: +characterId },
      select: {
        characterName: true,
        health: true,
        power: true,
      },
    });

    if (findCharacter === null) {
      res.status(404).json({ error: '캐릭터가 존재하지 않습니다.' });
      return;
    }

    res.status(200).json({ character_info: findCharacter });
  } catch (err) {
    res.status(500).json({ error: '캐릭터 조회에 실패했어요.' });
    console.log(error);
  }
});

export default router;
