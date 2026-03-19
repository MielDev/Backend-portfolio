const BlogPost = require('../models/BlogPost');

exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await BlogPost.getPublished();
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.getBySlug(req.params.slug);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.getAll();
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const id = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    await BlogPost.update(req.params.id, req.body);
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await BlogPost.delete(req.params.id);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
