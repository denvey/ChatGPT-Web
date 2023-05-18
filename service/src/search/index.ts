import { getGGDSearch, getGoogleSearch } from './search';
import dayjs from 'dayjs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const enableGoogleSearch = true;
const searchApiKeys = ['AIzaSyDl4ua6SiTy9b5nwOmC_0kzUVBGX8E07SQ', 'AIzaSyB5A5k94ZdhaAlqWDjwRShmzc8UWHPbG68']; // AIzaSyDl4ua6SiTy9b5nwOmC_0kzUVBGX8E07SQ AIzaSyB5A5k94ZdhaAlqWDjwRShmzc8UWHPbG68

const prefixPrompt = `你是 燕千云101号数字化员工，是基于 GPT-3.5 接口的AI机器人，请认真、负责、详细的回答用户的问题，用心完成用户提出的任务并使用简体中文进行回答。
`
const prefixPrompt2 = `你是 鲁迅先生，你的工作是写鲁迅文体的文章。你的回答尽可能简短明了（例如不要冗长），并且请使用简体中文进行回答。如果生成列表，请不要包含太多项。请保持项目数量短小。
`
const chatContextMap = {

};

export async function addSearchLog(log, table_name = 'prompt_log') {
  if (process.env.DB_URL) {
    try {
      // const dbo = await getMongoDb();
      // let ret = await dbo.collection(table_name).insertOne(log);
    } catch (err) {
      console.log('db error', err)
    } finally {
    }
  }
}

async function getSearch(text) {
  // return '';
  if (!text) {
    return '';
  }
  let searchArr = [];
  try {
    if (text?.startsWith('@')) {
      text = text.replace(/@.+ /, '');
    }
    const data = await getGGDSearch(text, 3, 3);
    // for (const str of searchArr) {
    //   data.push(...(await getGoogleSearch(str, 4, searchArr.length > 2 ? 1 : 2)))
    // }
    // Please combine the following internet information to assist in answering user questions.
    // Web search results:
    //   ${data.map((item, index) => `[${index + 1}] "${item.body}"`).join('\n\n')}
    // ` : '';
    const searchPrompt = data.length > 0 ? `
    Please use Chinese language combined with the following internet information to assist in answering user questions.
    Web search results:
      ${data.map((item, index) => `[${index + 1}] "${item.body}"
      URL: u${index}`).join('\n\n')}
      Make sure to cite results using markdown url ref "[[number](URL)]" notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.
    ` : '';
    return {
      searchPrompt,
      searchData: data
    };
  } catch (err) {
    return '';
  }
}

export async function search(text) {
  const searchResult = await getSearch(text);
  return searchResult;
}