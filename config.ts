const config = {
  // available both client + server
  serverBaseUrl: process.env.SERVER_BASE_URL!,
  adminToken: process.env.ADMIN_TOKEN!,
  jwtSecret: process.env.JWT_SECRET!,
  studentRole: process.env.STUDENT_ROLE!,
};

const imageConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  apiKey: process.env.CLOUDINARY_API_KEY!,
  apiSecret: process.env.CLOUDINARY_API_SECRET!,
};

export { config, imageConfig };
