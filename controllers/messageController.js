const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const id = await Message.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.getAll();
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Message.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Message status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.delete(req.params.id);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
