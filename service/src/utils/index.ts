interface SendResponseOptions<T = any> {
  type: 'Success' | 'Fail'
  message?: string
  data?: T
}

export function sendResponse<T>(options: SendResponseOptions<T>) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}

export function textReplaceUrl(text, arr) {
  const regex = /\[\[(\d)\]\(u(\d)\)\]/g;
  const replacedText = text.replace(regex, (match, p1, p2) => {
    const url = arr[p2].href;
    return `[[${p1}](${url})]`;
  });
  return replacedText;
}
