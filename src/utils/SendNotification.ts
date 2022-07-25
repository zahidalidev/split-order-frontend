import { pushNotificationEndpoint } from '../config/endPoint'

interface NotificationBody {
  to: string
  sound: string
  body: string
}

export const SentNotification = async (arr: NotificationBody[]) => {
  // const arr = [{
  //     "to": "ExponentPushToken[-pIuasJ4dIFEaaA4Jn1xBV]",
  //     "sound": "default",
  //     "body": "Hello world!"
  // }, {
  //     "to": "ExponentPushToken[-pIuasJ4dIFEaaA4Jn1xBV]",
  //     "badge": 1,
  //     "body": "You've got mail"
  // }]

  fetch(pushNotificationEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(arr)
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson new: ', responseJson)
    })
    .catch(error => {
      console.log('notify error: ', error)
    })
}
