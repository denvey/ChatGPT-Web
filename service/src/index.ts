import express from 'express'
// import prismaClint from '@prisma/client';
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import { userInfo, updateIntegral, proxyChat } from './utils/user'

// const prisma = new prismaClint.PrismaClient()
const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authori-zation,Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, X-Requested-With, Form-type, Cb-lang, Invalid-zation')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  let isError = false;
  const authoriZation = req.headers['authorization'];
  const user: any = await userInfo(authoriZation);
  
  try {
    // if (user.status === 110002) {
    //   return res.json(user);
    // }
    if (user.data?.is_money_level <=0 && user.data?.integral < 0) { 
      throw {
        data: null,
        message: '会员已过期或积分已使用完~，请充值或赚取积分再使用',
        type: 1,
        status:'Fail'
      }
    }
    const { prompt, options = {}, systemMessage, temperature, top_p, cid, uid } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      cid,
      uid,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    isError = true;
    if (error.type !==1 && user.data?.is_money_level <= 0) {
      error.message = '本次不扣除积分\n' + error.message
    }
    res.write(JSON.stringify(error))
  }
  finally {
    if (!isError) {
      // const user: any = await userInfo(req.headers['authori-zation']);
      // const authoriZation = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwd2QiOiJkNDFkOGNkOThmMDBiMjA0ZTk4MDA5OThlY2Y4NDI3ZSIsImlzcyI6ImxvY2FsaG9zdDo4MDgzIiwiYXVkIjoibG9jYWxob3N0OjgwODMiLCJpYXQiOjE2ODEzNzgzNzgsIm5iZiI6MTY4MTM3ODM3OCwiZXhwIjoxNjgzOTcwMzc4LCJqdGkiOnsiaWQiOjcsInR5cGUiOiJhcGkifX0.Ti9bmbwHWf8GnUsEoUju_YXk8IY-wt5tpYW9uQnhEzM';
      
      if (user.data?.is_money_level == 1) {
        updateIntegral({
          "integration_status": 2,
          "integration": 10,
          "is_other": true
        }, authoriZation).then(res => {
          console.log(res);
        })
      }
    }
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    // const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    // const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    const result: any = await userInfo(req.headers['authori-zation'] || req.headers['authorization']);
    res.send({ status: 'Success', message: '', data: { auth: true, model: currentModel(),  userInfo: result.data } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

// router.get('/chats', async (req, res) => {
//   const user: any = await userInfo(req.headers['authori-zation']);
//   const { uid: userId } = user.data;
//   const data = await prisma.chats.findMany({
//     where: {
//       userId,
//     }
//   });
//   res.json({ status: 'Success', message: '', data })
// })

// router.post('/chats', async (req, res) => {
//   const { title, uuid, id } = req.body;
//   const user: any = await userInfo(req.headers['authori-zation']);
//   const { uid: userId } = user.data;
//   const data = await prisma.chats.upsert({
//     where: {
//       id, 
//     },
//     update: {
//       title,
//       uuid,
//       status: 1,
//       userId
//     },
//     create: {
//       title,
//       uuid,
//       status: 1,
//       userId
//     },
//   });
  
//   res.json({ status: 'Success', message: '', data })
// })


// router.get('/chat', async (req, res) => {
//   const { userId, uuid } = req.query as any;
//   const data = await prisma.chat.findMany({
//     where: {
//       userId,
//       uuid
//     }
//   });
//   res.json({ status: 'Success', message: '', data })
// })



app.use('', router)
app.use('/api', router)
app.use('/proxy', proxyChat)

app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
