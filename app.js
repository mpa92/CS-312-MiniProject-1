const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for blog posts (no database)
let posts = [];

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts: posts });
});

app.post('/posts', (req, res) => {
    const { title, author, content } = req.body;
    const newPost = {
        id: Date.now().toString(),
        title: title,
        author: author,
        content: content,
        createdAt: new Date().toLocaleString()
    };
    posts.push(newPost);
    res.redirect('/');
});

app.get('/posts/:id/edit', (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render('edit', { post: post });
    } else {
        res.redirect('/');
    }
});

app.post('/posts/:id/edit', (req, res) => {
    const postId = req.params.id;
    const { title, author, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        posts[postIndex] = {
            id: postId,
            title: title,
            author: author,
            content: content,
            createdAt: posts[postIndex].createdAt,
            updatedAt: new Date().toLocaleString()
        };
    }
    res.redirect('/');
});

app.post('/posts/:id/delete', (req, res) => {
    const postId = req.params.id;
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
