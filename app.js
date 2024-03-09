document.addEventListener("DOMContentLoaded", function () {
  const addBookForm = document.getElementById("add-book-form");
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const statusSelect = document.getElementById("status");
  const unfinishedBooksList = document.getElementById("unfinished-books");
  const finishedBooksList = document.getElementById("finished-books");

  addBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const author = authorInput.value;
    const year = parseInt(yearInput.value);
    const status = statusSelect.value;

    const book = {
      id: +new Date(), // Membuat ID unik berdasarkan timestamp
      title,
      author,
      year,
      isComplete: status === "selesai"
    };

    addBookToShelf(book);

    // Clear input fields after adding book
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
  });

  function addBookToShelf(book) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${book.title} - ${book.author} (${book.year})</span>
      <button class="delete-btn">Hapus</button>
    `;

    const deleteButton = li.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      deleteBook(li, book);
    });

    const moveButton = document.createElement("button");
    moveButton.textContent = book.isComplete ? "Kembalikan" : "Selesaikan";
    moveButton.addEventListener("click", function () {
      moveBook(li, book);
    });

    li.appendChild(moveButton);

    if (book.isComplete) {
      finishedBooksList.appendChild(li);
    } else {
      unfinishedBooksList.appendChild(li);
    }

    saveBooks();
  }

  function deleteBook(bookElement, book) {
    if (book.isComplete) {
      finishedBooksList.removeChild(bookElement);
    } else {
      unfinishedBooksList.removeChild(bookElement);
    }

    saveBooks();
  }

  function moveBook(bookElement, book) {
    if (book.isComplete) {
      book.isComplete = false;
      unfinishedBooksList.appendChild(bookElement);
    } else {
      book.isComplete = true;
      finishedBooksList.appendChild(bookElement);
    }

    saveBooks();
  }

  function saveBooks() {
    const unfinishedBooks = Array.from(unfinishedBooksList.children).map(bookElement => {
      return extractBookData(bookElement);
    });

    const finishedBooks = Array.from(finishedBooksList.children).map(bookElement => {
      return extractBookData(bookElement);
    });

    const allBooks = { unfinished: unfinishedBooks, finished: finishedBooks };

    localStorage.setItem("books", JSON.stringify(allBooks));
  }

  function extractBookData(bookElement) {
    const titleAuthorYear = bookElement.querySelector("span").textContent.split(" - ");
    const title = titleAuthorYear[0];
    const authorYear = titleAuthorYear[1].split(" (");
    const author = authorYear[0];
    const year = parseInt(authorYear[1].replace(")", ""));
    const isComplete = bookElement.parentNode.id === "finished-books";
    return { title, author, year, isComplete };
  }

  function loadBooks() {
    const books = JSON.parse(localStorage.getItem("books"));

    if (books) {
      books.unfinished.forEach(book => addBookToShelf(book));
      books.finished.forEach(book => addBookToShelf(book));
    }
  }

  loadBooks();
});

