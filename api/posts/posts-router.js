// implement your posts router here
const express = require('express')
const Posts = require('./postss-model')
const router = express.Router()

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving posts',
            })
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(posts => {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving posts',
            });
        });
});

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const comments = await Posts.findPostsComments(id)
        if(comments.length === 0) {
            res.status(404).json({
                message: "The post with this ID does not exist"
            })
        } else {
            res.status(200).json(comments)
        }
        } catch (err) {
        res.status(500).json({
            message: "The comments could not be retreived"
        })
    }
});

router.post('/', (req, res) => {
    Posts.add(req.body)
        .then(posts => {
            res.status(201).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding a post',
            });
        });
});

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The post has been deleted' });
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error removing the post',
            });
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    Posts.update(req.params.id, changes)
      .then(posts => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ message: 'The post could not be found' });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: 'Error updating the post',
        });
      });
  });
module.exports = router