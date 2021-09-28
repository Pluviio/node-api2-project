// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
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
        const comments = await Posts.findPostComments(id)
        if(comments.length === 0) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            res.status(200).json(comments)
        }
    }
    catch {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body
        if(!title || !contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }
        else {
            const id = await Posts.insert(req.body)
            res.status(201).json({...req.body, id})
        }
    }
    catch {
       res.status(500).json({
           message: "There was an error while saving the post to the database"
       }) 
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Posts.findById(id)
 
        if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            await Posts.remove(id)
            res.status(200).json(post)
        }
    }
    catch {
        res.status(500).json({
            message: "The post could not be removed"
        }) 
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, contents } = req.body
        const posts = await Posts.findById(id)

        if(!title || !contents){
            res.status(400).json({
                message: "Please provide title and contents for the post"
            })
        }
        else if(!posts){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
        else {
            await Posts.update(id, req.body)
            const updatedPost = await Posts.findById(id)
            res.status(200).json(updatedPost)
        }
    }
    catch {
        res.status(500).json({
            message: "The post information could not be modified"
        }) 
    }
})
  
module.exports = router