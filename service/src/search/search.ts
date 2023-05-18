import axios from "axios";

export async function getGGDSearch(text, errCount = 4, max_results = 2) {
  try {
    if (text.startsWith('@')) {
      text = text.replace(/@.+ /, '');
    }
    const { data } = await axios.get(`http://8.222.171.198:8000/search?max_results=${max_results}&q=${text}`);
    return data;
  } catch (err) {
    console.log(err, err.response, err.response?.data, err.response?.data?.error?.details);
    if (errCount > 0) {
      return await getGGDSearch(text, errCount - 1, max_results);
    }
    return '';
  }
}


export async function getGoogleSearch(text, errCount = 4, max_results = 2) {
  // return '';
  if (text?.length > 100 || !text) {
    // TODO: 太长的输入文本问GPT本身，这个问题要用哪些关键词去搜索。然后一个个搜放入知识中
    return '';
  }
  try {
    if (text.startsWith('@')) {
      text = text.replace(/@.+ /, '');
    }
    const { data } = await axios({
      method: 'get',
      url: `https://customsearch.googleapis.com/customsearch/v1?cx=d6c405a46743b4397&q=${encodeURIComponent(text)}&key=AIzaSyD1_8wYaqoQyZPEmvim2ehHGTpDc635Qvo&num=4&h1=zh-CN&gl=zh-CN&safe=active`, // {_.sample(searchApiKeys)}
      headers: {
        'Accept': 'application/json'
      }
    });
    const _data = data?.items.slice(0, 3).map(item => {
      return {
        ...item,
        body: item.snippet,
        href: item.link
      }
    })
    return _data;
    // return `${data.items[0]?.title} ${data.items[0]?.snippet} ${data.items[1]?.title} ${data.items[1]?.snippet} ${data.items[2]?.title} ${data.items[2]?.snippet} ${data.items[3]?.title} ${data.items[3]?.snippet}`
  } catch (err) {
    if (errCount > 0) {
      return await getGoogleSearch(text, errCount - 1);
    }
    return '';
  }
}