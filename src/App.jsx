import { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './components/BookList';
import ViewBook from './components/ViewBook';
import BookForm from './components/BookForm';

const API_URL = '/api/books';

const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle API errors
  const handleError = (err) => {
    if (err.response) {
      // Server responded with a status code outside 2xx range
      const message = err.response.data?.message || err.response.data || 'Request failed.';
      setError(`Error: ${err.response.status} - ${message}`);
    } else if (err.request) {
      // Request was made but no response received
      setError('Network error: No response received from server.');
    } else {
      // Something else caused the error
      setError(`Error: ${err.message}`);
    }
  };

  // Fetch books when component mounts
  useEffect(() => {
    // Fetch books from API
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setBooks(Array.isArray(response.data) ? response.data : []);
        setError(null);  // Clear any previous errors
        setLoading(false);
      } catch (err) {
        handleError(err);
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);

  const handleView = (id) => {
    setSelectedBook(books.find((book) => book.id === id));
    setViewMode('view');
  };

  const handleEdit = (id) => {
    setSelectedBook(books.find((book) => book.id === id) || null);
    setViewMode('edit');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBooks(books.filter((book) => book.id !== id));
      setViewMode('list');
      setError(null);  // Clear any previous errors
    } catch (err) {
      handleError(err);
    }
  };

  const handleSave = async (book) => {
    try {
      if (book.id) {
        // Update existing book
        await axios.put(`${API_URL}/${book.id}`, book);
        setBooks(books.map((b) => (b.id === book.id ? book : b)));
      } else {
        // Create new book
        const response = await axios.post(API_URL, book);
        setBooks([...books, response.data]);
      }
      setViewMode('list');
      setError(null);  // Clear any previous errors
    } catch (err) {
      handleError(err);
    }
  };

  const handleBack = () => {
    setViewMode('list');
  };

  // Function to handle creating a new book
  const handleCreateNewBook = () => {
    setSelectedBook(null); // Reset selectedBook to null for new book creation
    setViewMode('edit');    // Switch to 'edit' mode to show the form
  };

  // Rendering loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      {viewMode === 'list' && (
        <div>
          <BookList
            books={books}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateNewBook}  // Pass onCreate prop to BookList
          />
        </div>
      )}
      {viewMode === 'view' && (
        <ViewBook
          book={selectedBook}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      )}
      {viewMode === 'edit' && (
        <BookForm book={selectedBook} onSave={handleSave} onBack={handleBack} />
      )}
    </div>
  );
};

export default App;
