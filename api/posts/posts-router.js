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