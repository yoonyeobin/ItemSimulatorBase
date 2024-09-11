import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// [필수] 1. 아이템 생성
// 1. 아이템 코드, 아이템 명, 아이템 능력, 아이템 가격을 req(request)에서 json으로 전달받기
// 2. 데이터베이스에 아이템 저장하기
router.post('/item/create/:itemId', async (req, res) => {
  try {
    const itemCode = req.body.item_code;
    const itemName = req.body.item_name;
    const atk = req.body.atk;
    const price = req.body.price;

    const createItem = await prisma.item.create({
      data: {
        itemCode: itemCode,
        itemName: itemName,
        atk: atk,
        price: price,
      },
    });

    res.status(200).json({ itme_info: createItem });
  } catch (error) {
    res.status(500).json({ error: '아이템 입력에 실패했어요' });
    console.log(error);
  }
});

// [필수] 2. 아이템 목록 조회
router.get('/item/list', async (req, res) => {
  try {
    const list = await prisma.item.findMany({
      select: {
        itemCode: true,
        itemName: true,
        atk: true,
        price: true,
      },
    });

    return res.status(200).json({ data: list });
  } catch (err) {
    res.status(500).json({ error: '목록 조회에 실패하였습니다.' });
    console.log(error);
  }
});

// [필수] 3. 특정 아이템 조회
// 아이템 코드는 URL의 parameter로 전달받기
router.get('/item/:itemCode', async (req, res) => {
  try {
    const itemCode = req.params.itemCode;
    const findItem = await prisma.item.findUnique({ where: { itemCode: +itemCode } });
    if (findItem === null) {
      res.status(404).json({ error: '아이템이 존재하지 않습니다.' });
      return;
    }

    res.status(200).json({ itme_info: findItem });
  } catch (err) {
    res.status(500).json({ error: '아이템 조회에 실패했어요.' });
    console.log(error);
  }
});

// [필수] 4. 특정 아이템 수정
// 아이템 코드는 URL의 parameter로 전달 받기
// 수정할 아이템 명, 아이템 능력을 req(request)에서 json으로 전달받기
router.put('/item/:itemCode', async (req, res) => {
  try {
    const { itemCode } = req.params;
    const itemName = req.body.item_name;
    const atk = req.body.atk;
    const price = req.body.price;
    const item = await prisma.item.findUnique({ where: { itemCode: +itemCode } });

    if (!item) {
      return res.status(404).json({ error: '존재하지 않는 아이템입니다.' });
    }

    await prisma.item.update({
      data: {
        itemName: itemName,
        atk: atk,
        price: price,
      },
      where: {
        itemCode: +itemCode,
      },
    });

    return res.status(200).json({ data: '아이템이 수정되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '아이템 수정에 실패했어요.' });
    console.log(err);
  }
});

export default router;
