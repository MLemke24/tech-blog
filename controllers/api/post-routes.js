const router = require('express').Router();
const { Post, User, Comment } = require('../../models');

// GET all posts
router.get('/', (req,res) =>{
    Post.findAll({
        order: [['created_at', 'DESC']], 
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
          {
            model: Comment,
            attritubes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
            model: User,
            attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
})

// GET a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id','title', 'content', 'created_at'],
        include: [
          {
            model: Comment,
            attritubes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
            model: User,
            attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
          res.json(dbPostData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
})

// POST a new article
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
})

// PUT update a post 
router.put('/:id', (req, res) => {
    Post.update(
        {
          title: req.body.title
        },
        {
          where: {
            id: req.params.id
          }
        }
      )
        .then(dbPostData => {
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
          res.json(dbPostData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
})

// DELETE a post 
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
          id: req.params.id
        }
        })
        .then(dbPostData => {
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
          res.json(dbPostData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
})

module.exports = router;