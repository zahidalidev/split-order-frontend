import { pushNotificationEndpoint } from '../config/endPoint'
import { getStoreUser } from './getFromStorage'

interface NotificationBody {
  to: string
  sound: string
  body: string
}

export const SentNotification = async (arr: NotificationBody[]) => {
  const { _id } = await getStoreUser()
  return await fetch(pushNotificationEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
      from_id: _id
    },
    body: JSON.stringify(arr)
  })
}
