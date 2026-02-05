const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

const db = new sqlite3.Database('./Database/book.sqlite');

app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY ,
  title TEXT ,
  author TEXT 
)`);


app.get("/", (req, res) => {
  res.send("Hello book World!");
});


app.get('/books', (req, res) => {
  db.all('SELECT * FROM books', [], (err, rows) => {
    if (err) {
        res.status(500).send({ error: err.message });
    } else {
        res.json(rows);
    }
});
});

app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            if (!row) {
                res.status(404).send({ error: 'Book not found' });
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/books', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', book.title, book.author, function(err) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            book.id = this.lastID;
            res.status(201).send(book);
        }
    });
});

app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', book.title, book.author, req.params.id, function(err) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.send(book);
        }
    });
});

app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send({ error: err.message });
        } else {
            res.status(204).send();
        }
    }   
);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
