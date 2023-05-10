import 'isomorphic-fetch'
import fetch from 'node-fetch'
import axios from 'axios';

const ADMIN_API = 'https://admin.qqshsh.com';

export function userInfo (token) {
  return fetch('http://qw.qqshsh.com/api/userinfo', {
    headers: {
      'Authori-zation': token
    }
  }).then(res => res.json());
}

export function addMessage (data: {
  inversion?: number,
  text?: string,
  status?: number,
  parentMessageId?: string,
  role?: string
  userId?: number,
  fromUid?: number,
  toUid?: number,
  chat?: {
    id: number,
  }
}) {
  return axios({
    url: `${ADMIN_API}/api/message:create`,
    method: 'POST',
    data,
  })
}

export async function updateChats (data: {
  id: number,
  title: string,
  content?: string,
  status?: number,
}) {
  const res = await axios(`${ADMIN_API}/api/chats:get?filterByTk=${data.id}&appends%5B%5D=createdBy&appends%5B%5D=updatedBy`);
  if (res.data.data.title !== '新会话') {
    delete data.title;
  } 
  return axios({
    url: `${ADMIN_API}/api/chats:update?filterByTk=${data.id}`,
    method: 'POST',
    data,
  })
}

export function updateIntegral (data: {
  "integration_status": number,
  "integration": number,
  "is_other": boolean
}, token) {
  const url = `http://qw.qqshsh.com/api/user/update`;
  return axios({
    url,
    method: 'POST',
    headers: {
      'Authori-zation': token
    },
    data
  });
}

/**
 * admin 应用转发
 * @param req 
 * @param res 
 * @returns 
 */
export async function proxyChat (req, res) {
  
  try {
    const user: any = await userInfo(req.headers['authori-zation'] || req.headers['authorization']);
    if (user.status === 110002) {
      return res.json(user);
    }
    const data = await axios({
      url: `http://admin.qqshsh.com/api${req.url}`, 
      method: req.method,
      params: {
        // ...req.query,
        'filter[userId]': user.data.uid
      },
      data: {
        ...req.body,
        userId: user.data.uid
      }
    });
    return res.json({
      status: 200,
      msg:'',
      ...data.data
    });
  } catch (err) {
    res.json(err.response?.data);
  }
}