const prisma = require("./db");

async function testConnection() {
  try {
    await prisma.$connect();

    console.log("Database connected successfully!");

    const result = await prisma.$queryRaw`SELECT 1`;

    console.log("Database test:", result);
  } catch (error) {
    console.log("Database connection failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
