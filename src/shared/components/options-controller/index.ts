import { NextRequest } from 'next/server'

const pathParse = (urlString: string) => {
  const url = new URL(urlString)
  const paths = url.pathname.split('/').filter(Boolean)
  return paths
}
export const operationsController = async (req: NextRequest) => {
  const path = pathParse(req.url)
  const body = await req.json()
  let token:any = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
  if (token) { token = JSON.parse(token) }
  return { path, body, token }
}
