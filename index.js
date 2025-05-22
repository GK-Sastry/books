import express from "express";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store
let books = [];
let bookIDCounter = 1;

// -------------------------
// Create a new book (POST)
// -------------------------
app.post("/books", (req, res) => {
  const { title, author } = req.body;

  if (title && author) {
    books.push({ id: bookIDCounter++, title, author });
    res.status(201).send("Added new book");
  } else {
    res
      .status(400)
      .send("Incorrect book details. 'title' and 'author' are required.");
  }
});

// -------------------------
// Get all books (GET)
// -------------------------
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// -------------------------
// Get a book by ID (GET)
// -------------------------
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));

  if (!book) {
    res.status(404).send("Book with that ID not found");
  } else {
    res.status(200).json(book);
  }
});

// -------------------------
// Update a book completely (PUT)
// Requires full object (title & author)
// -------------------------
app.put("/books/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).send("Book not found");
  }

  const { title, author } = req.body;
  if (!title || !author) {
    return res
      .status(400)
      .send("Both 'title' and 'author' are required for full update");
  }

  books[bookIndex] = { id: books[bookIndex].id, title, author };
  res.status(200).json(books[bookIndex]);
});

// -------------------------
// Update part of a book (PATCH)
// -------------------------
app.patch("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).send("Book not found");
  }

  const { title, author } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;

  res.status(200).json(book);
});

// -------------------------
// Delete a book by ID (DELETE)
// -------------------------
app.delete("/books/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  const deletedBook = books.splice(bookIndex, 1);
  res.status(200).json({ message: "Book deleted", book: deletedBook[0] });
});

// -------------------------
// Start the server
// -------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
