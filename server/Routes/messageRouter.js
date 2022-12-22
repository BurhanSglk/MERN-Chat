const express = require("express")
const Message = require('../models/messageModel')
const router = express.Router();

router.post("/addMsg", async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.status(200).json({ massege: "AddMessage successful" });
    return res.status(200).json({ massege: "AddMessage failed" });

  } catch (error) {
    return res.status(400).json({ message: error.massege });
  }
});

router.post("/getMsg", async (req, res) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectedMessages)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router
