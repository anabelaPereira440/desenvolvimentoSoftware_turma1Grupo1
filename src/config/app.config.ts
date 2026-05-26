export const appConfig = {
  auth: {
    jwtSecret: 'breathcare_secret_key_2026', // em produção: process.env.JWT_SECRET
    jwtExpiresIn: '2h'
  },
  server: {
    port: 3000
  }
};