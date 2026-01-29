require("dotenv").config();
const express = require('express');
const app = express();

app.use(express.json());
 

let books = [
    { id: 1, title: "book 1", author: "author 1" },
    { id: 2, title: "book 2", author: "author 2" },
    { id: 3, title: "book 3", author: "author 3" }
]

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book)res.status(404).send('book not found');
    res.json(book);
});

app.post('/books', (req, res) => {
    const book = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(book);
    res.status(201).json(book);
});

app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('book not found');
    book.title =req.body.title;
    book.author = req.body.author;
    res.send(book);
});

app.delete('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('book not found');
    const index = books.indexOf(book);
    books.splice(index, 1);
    res.send(book);
}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});