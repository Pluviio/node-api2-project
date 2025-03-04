// implement your server here
const express = require('express');
const postsRouter = require('./posts/posts-router')
const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter)
// require your posts router and connect it here

module.exports = server;