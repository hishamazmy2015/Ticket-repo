import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // res.send("Hi There");
  req.session = null;
});

export { router as singoutRouter };
