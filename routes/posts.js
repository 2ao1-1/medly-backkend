const express = require('express');
const Post = require('../models/Post');
const verifyToken = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      author: req.user.id, // User from token
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Returns a list of posts
 */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The requested post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username email'
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post (Only owner can update)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated post
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update post
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post (Only owner can delete)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check if the user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
