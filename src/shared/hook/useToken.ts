import { jwtVerify, SignJWT } from 'jose'

export const useToken = () => {
  const getToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')

  const jwtSecret = process.env.JWT_SECRET || 'dev-secret'
  const secretKey = new TextEncoder().encode(jwtSecret)

  const encodedToken = async (data: any) => {
    await new SignJWT(data)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey)
  }
  const decodedToken = async (token: any) => await jwtVerify(token, secretKey)
  return {
    getToken,
    encodedToken,
    decodedToken,
  }
}
