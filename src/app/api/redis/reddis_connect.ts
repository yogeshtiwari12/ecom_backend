import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.REDISH_URL as string,
  token: process.env.REDISH_tOKEN as string,
})


// export default redis;