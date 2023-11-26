import express from "express";
import { createHash } from "node:crypto";

const app = express();
const PORT = 8000;
const DELAY = 1000; //ms

/**
 * Generate unique string, hash it using sha-256, then return the hash string
 *
 * @returns {string} hash
 */
function generateUniqueHash() {
  // Use timestamp plus random value to ensure unique value
  const uniqueString = `${Date.now()}${Math.random()}`;

  const hash = createHash("sha256").update(uniqueString).digest("hex");

  // console.log({ uniqueString, hash });

  return hash;
}

// routes
app.get("/generate-unique-256-hash", (req, res) => {
  setTimeout(() => {
    try {
      const hash = generateUniqueHash();

      res.status(200).send({ hash });
    } catch (error) {
      res.status(500).send({ error: "Hash generation failed" });
    }
  }, DELAY);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
