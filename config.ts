const config = {
  // available both client + server
  serverBaseUrl: process.env.SERVER_BASE_URL,
  adminToken: process.env.ADMIN_TOKEN,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
