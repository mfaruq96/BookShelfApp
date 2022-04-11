const bookShelf = [];
const RENDER_EVENT = "render-bookShelf";

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (book of data) {
            bookShelf.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBookShelf();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookShelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
};

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function addBookShelf() {
    const textBookShelfTitle = document.getElementById("bookShelfTitle").value;
    const textBookShelfAuthor = document.getElementById("bookShelfAuthor").value;
    const numberBookShelfYear = document.getElementById("bookShelfYear").value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBookShelfTitle, textBookShelfAuthor, numberBookShelfYear, false);
    bookShelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return +new Date();
};

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

function makeBook(bookObject) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Penulis : " + bookObject.author;

    const numberYear = document.createElement("p");
    numberYear.innerText = "Tahun : " + bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("mf-result")
    textContainer.append(textTitle, textAuthor, numberYear);

    const container = document.createElement("div");
    container.append(textContainer);
    container.setAttribute("id", `${bookObject.id}`);

    if (bookObject.isCompleted) {

        const undoButton = document.createElement("button");
        undoButton.classList.add("mf-button-done");
        undoButton.classList.add("mf-text-white");
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(bookObject.id);
            function undoTaskFromCompleted(bookId) {

                const bookTarget = findBook(bookId);
                if (bookTarget == null) return;

                bookTarget.isCompleted = false;
                document.dispatchEvent(new Event(RENDER_EVENT));
                saveData();
            }
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("mf-button-delete");
        trashButton.classList.add("mf-text-white");
        trashButton.innerText = "Hapus buku";
        trashButton.onclick = function () {
            alert('Data berhasil dihapus');
        };
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bookObject.id);
            function removeTaskFromCompleted(bookId) {
                const bookTarget = findBookIndex(bookId);
                if (bookTarget === -1) return;
                bookShelf.splice(bookTarget, 1);

                document.dispatchEvent(new Event(RENDER_EVENT));
                saveData();
            };
            function findBookIndex(bookId) {
                for (index in bookShelf) {
                    if (bookShelf[index].id === bookId) {
                        return index
                    }
                }
                return -1
            };
        });

        container.append(undoButton, trashButton);
    } else {


        const checkButton = document.createElement("button");
        checkButton.classList.add("mf-button-done");
        checkButton.classList.add("mf-text-white");
        checkButton.innerText = "Selesai dibaca";
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(bookObject.id);
            saveData();
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("mf-button-delete");
        trashButton.classList.add("mf-text-white");
        trashButton.innerText = "Hapus buku";
        trashButton.onclick = function () {
            alert('Data berhasil dihapus');
        };
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bookObject.id);
            function removeTaskFromCompleted(bookId) {
                const bookTarget = findBookIndex(bookId);
                if (bookTarget === -1) return;
                bookShelf.splice(bookTarget, 1);

                document.dispatchEvent(new Event(RENDER_EVENT));
                saveData();
            };
            function findBookIndex(bookId) {
                for (index in bookShelf) {
                    if (bookShelf[index].id === bookId) {
                        return index
                    }
                }
                return -1
            };
        });

        container.append(checkButton, trashButton);
    }

    return container;
};

function addTaskToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBook(bookId) {
    for (bookItem of bookShelf) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }
    return null
};

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("bookShelf");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completedBookShelf");
    completedBookList.innerHTML = "";

    for (bookItem of bookShelf) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isCompleted == false)
            uncompletedBookList.append(bookElement);
        else
            completedBookList.append(bookElement);
    }
});
