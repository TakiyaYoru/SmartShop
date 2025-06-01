import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema.js";
import { useGraphQLMiddleware } from "@envelop/graphql-middleware";
import { permissions } from "./permissions.js";
import { db } from "./config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

import { initDatabase } from "./data/init.js";

// Initialize database connection
await initDatabase();

const signingKey = process.env.JWT_SECRET;

const yoga = createYoga({ 
  schema,
  graphqlEndpoint: "/",
  plugins: [useGraphQLMiddleware([permissions])],
  context: async ({ request }) => {
    const authorization = request.headers.get("authorization") || "";
    let user = null;

    if (authorization.startsWith("Bearer ")) {
      const token = authorization.substring(7, authorization.length);
      
      try {
        const decoded = jwt.verify(token, signingKey);
        user = decoded;
      } catch (error) {
        console.log("JWT verification failed:", error.message);
      }
    }

    return {
      db: db,
      user: user,
      secret: request.headers.get("secret"),
    };
  },
});

// Tạo Express app
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serving static images - theo document
app.get("/img/:filename", (req, res) => {
  const filename = req.params.filename;
  const pathDir = path.join(__dirname, "/img/" + filename);
  
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(pathDir)) {
    return res.status(404).send("File not found");
  }
  
  res.sendFile(pathDir);
});

// GraphQL endpoint
app.use(yoga.graphqlEndpoint, yoga);

const PORT = process.env.PORT || 4000;

// Tạo thư mục img nếu chưa có
const imgDir = path.join(__dirname, "img");
if (!fs.existsSync(imgDir)) {
  console.log('Creating img directory...');
  fs.mkdirSync(imgDir, { recursive: true });
}

app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});