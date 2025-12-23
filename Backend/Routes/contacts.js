import express from "express";

const router = express.Router();

// Contact route
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log(
    `Contact form submitted: ${name}, ${email}, ${subject}, ${message}`
  );

  res.status(200).json({ message: "Contact form submitted successfully" });
});

export default router;
