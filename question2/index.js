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

/**
 * Recursively requests a hash from another endpoint until finding a hash
 * where the last character is an odd number.
 *
 * @returns {Object} An object indicating success when an odd-ending hash is found.
 */
async function requestOddHash() {
  const response = await fetch(
    `http://localhost:${PORT}/generate-unique-256-hash`
  );
  const { hash } = await response.json();

  // get the last character
  const lastChar = hash.slice(-1);

  console.log({ hash, lastChar });

  if (parseInt(lastChar) % 2 === 1) {
    return { success: true };
  } else {
    // recursively call `requestOddHash` function until odd value is received
    return await requestOddHash();
  }
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

app.get("/find-odd-ending-hash", async (req, res) => {
  try {
    const result = await requestOddHash();

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error requesting odd hash" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
