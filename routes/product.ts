import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Products API");
});

export default router;
