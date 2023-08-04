const listBook = document.querySelector('.js-list');
const listCategory = document.querySelector('.js-container-category');
listBook.addEventListener('click', handlerClickBook);
// -----------------запит на всі категоріі-----
function serviceBook() {
  return fetch('https://books-backend.p.goit.global/books/top-books').then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    }
  );
}
// -------------------category list request-----

function serviceCategory() {
  return fetch('https://books-backend.p.goit.global/books/category-list').then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    }
  );
}
// -----------------------request for the selected category -----
function serviceThisCategory(res) {
  return fetch(
    `https://books-backend.p.goit.global/books/category?category=${res}`
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

serviceBook()
  .then((data) => {
    listBook.insertAdjacentHTML('beforeend', createMarcup(data));
    const itemCategory = document.querySelectorAll('.js-add-list');
    for (let i = 0; i < data.length; i += 1) {
      itemCategory[i].insertAdjacentHTML(
        'beforeend',
        createBooks(data[i].books)
      );
    }
  })
  .catch((err) => console.log(err));

serviceCategory()
  .then((data) => {
    listCategory.insertAdjacentHTML('beforeend', createCategory(data));
    listCategory.addEventListener('click', onClick);
  })
  .catch((err) => console.log(err));

function onClick(evt) {
  const result = evt.target.textContent;

  serviceThisCategory(result)
    .then((data) => {
      console.log(typeof result);
      listBook.insertAdjacentHTML('beforeend', createNewBooks(data));
    })
    .catch((err) => console.log(err));
}

function createMarcup(arr) {
  return arr
    .map(
      ({ books: [{ _id, list_name }] }) => `
  <li class="js-item" data-id="${_id}">
        <h3>${list_name}</h3>
        <ul class="js-add-list"></ul>
        <button type="button">See more</button>
      </li>`
    )
    .join('');
}

function createCategory(arr) {
  return arr
    .map(
      ({ list_name }) => `<li class="js-item-category">
  ${list_name}</li>`
    )
    .join('');
}

function handlerClickBook(evt) {
  const bookItem = evt.target.closest('.js-book-item');
  if (bookItem) {
    const { id } = bookItem.dataset;
    console.log('id:', id);
  }
}

function createBooks(arr) {
  return arr
    .map(
      ({ _id, book_image, author, title }) =>
        `<li class="js-book-item" data-id="${_id}" >
        <img src="${book_image}" alt="${title}">
    <h3>${title}</h3>
    <p>${author}</p>
      </li>`
    )
    .join('');
}

function createNewBooks(arr) {
  return arr
    .map(
      ({ books: [{ book_image, author, title }] }) => `
  <li>
        <img src="${book_image}" alt="${title}">
        <h3>${title}</h3>
        <p>${author}</p>
      </li>`
    )
    .join('');
}
