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
  const url = `${ADMIN_API}/api/chats/${data.id}`;
  const res = await axios(url);
  if (res.data.data.title !== '新会话') {
    delete data.title;
  } 
  return axios({
    url: url,
    method: 'PUT',
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
    return res.json(data.data)
  } catch (err) {
    res.json(err.response?.data);
  }
}