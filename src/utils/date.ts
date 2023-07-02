export const dateTime = () => {
  let message = ''
  const date = new Date().getHours()
  if (date < 11 && date >= 6) {
    message = '上午好'
  } else if (date >= 11 && date < 13) {
    message = '中午好'
  } else if (date >= 13 && date < 18) {
    message = '下午好'
  } else {
    message = '晚上好'
  }
  return message
}
