const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const serverPort = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for blog posts (no database)
var blogPosts = [];

// Routes
app.get('/', function(req, res) {
    res.render('index', { posts: blogPosts });
});

app.post('/posts', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    
    const newPost = {
        id: Date.now().toString(),
        title: title,
        author: author,
        content: content,
        createdAt: new Date().toLocaleString(),
    };
    blogPosts.push(newPost);
    res.redirect('/');
});

app.get('/posts/:id/edit', function(req, res) {
    const postId = req.params.id;
    var foundPost = null;
    
    for (var i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === postId) {
            foundPost = blogPosts[i];
            break;
        }
    }
    
    if (foundPost) {
        res.render('edit', { post: foundPost });
    } else {
        res.redirect('/');
    }
});

app.post('/posts/:id/edit', (req, res) => {
    const postId = req.params.id;
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    
    var postIndex = -1;
    for (var i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === postId) {
            postIndex = i;
            break;
        }
    }
    
    if (postIndex !== -1) {
        blogPosts[postIndex] = {
            id: postId,
            title: title,
            author: author,
            content: content,
            createdAt: blogPosts[postIndex].createdAt,
            updatedAt: new Date().toLocaleString()
        };
    }
    res.redirect('/');
});

app.post('/posts/:id/delete', function(req, res) {
    const postId = req.params.id;
    var filteredPosts = [];
    
    for (var i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id !== postId) {
            filteredPosts.push(blogPosts[i]);
        }
    }
    
    blogPosts = filteredPosts;
    res.redirect('/');
});

app.listen(serverPort, function() {
    console.log('Server is running on http://localhost:' + serverPort);
});
