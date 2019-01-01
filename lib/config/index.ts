export const config = {
  app: {
    port: 7777,
  },
  db: {
    mongoUri: "mongodb://127.0.0.1/library",
  },
  jwt: {
    expiresIn: "7d",
    secretKey: "C0b4d1b4c4.",
  },
};
