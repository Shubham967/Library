let  addBook = document.querySelector('.New-Book');
let bookForm = document.querySelector('.Add-Book-Section');
let addBookBtn = document.querySelector('.add-book');
let titleInput = document.querySelector('#book-title');
let authorInput = document.querySelector('#book-author');
let pagesInput = document.querySelector('#book-pages');
let statusInput = document.getElementsByName('book-status');
let libraryBooks = document.querySelector('.Books');
let closeFormBtn = document.querySelector('.close-form');
const pattern = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
let Editing = false
let editBookIdx = null;

let myLibrary = [
    {
        title: "Godan",
        author: "Munshi Premchand",
        pages: 322,
        status: "Not Read"
    }
];

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

function ClearForm(){
    titleInput.value = "";
    authorInput.value = "";
    pagesInput.value = "";

    let titleError = document.querySelector('#book-titleError');
    let authorError = document.querySelector('#book-authorError');
    let pagesError = document.querySelector('#book-pagesError');

    console.log(titleError)

    if(titleError) {
        titleError.remove();
    }

    if(authorError) {
        authorError.remove();
    }

    if(pagesError) {
        pagesError.remove();
    }
}


function ToggleBookForm(toggle){
    if (toggle) {
        bookForm.style.display = 'flex';
    }
    else {
        bookForm.style.display = 'none';
        ClearForm();
    }
}

function RemoveError(event) {
   if(event.target.Value != '') {
    event.target.removeEventListener('input',RemoveError)
     document.querySelector(`#${event.target.id}Error`).remove();
   }
}

function addError(element) {
    let spanError = document.createElement('span');
    spanError.textContent = `Please Enter Valid ${element.id}`;
    spanError.id = `${element.id}Error`;
    spanError.classList.add('errorText');
    element.parentNode.insertBefore(spanError,element);

    element.addEventListener('input', RemoveError);
}

function ValidateFormData() {  

   if (titleInput.value == "" && document.querySelector('#book-titleError') == null) {
    addError(titleInput);
    return false
   }
   if (authorInput.value == "" && document.querySelector('#book-authorError') == null) {
    addError(authorInput);
    return false;
   }
   if (pagesInput.value == "" && document.querySelector('#book-pagesError') == null) {
    addError(pagesInput);
    return false;
   }

   let submit = Number.isInteger(Number(pagesInput.value));
   if (pagesInput.value <= 0 || submit == false){
    if(document.querySelector('#book-pagesError') == null){
        addError(pagesInput);
        return false;
    }
   }

   if(pattern.test(titleInput.value) == false && document.querySelector('#book-titleError') == null){
    addError(titleInput);
    return false;
   }

   if(pattern.test(authorInput.value) == false && document.querySelector('#book-authorError') == null){
    addError(authorInput);
    return false;
   }

   return true;

//    if (titleInput.value == "" || pagesInput.value == "" || authorInput.value == "" || pagesInput.value <= 0 || submit == false)  {
//     return false;
//    } 
//    else {
//     return true;
//    }
}

function checkIfAdded() {
    if(!Editing) return false;
    if(editBookIdx || editBookIdx == 0) {
        let bookObj = myLibrary[editBookIdx]
        bookObj.title = titleInput.value;
        bookObj.author = authorInput.value;
        bookObj.pages = pagesInput.value;
        let Status;

        for(let i= 0; i<statusInput.length;i++) {
          if(statusInput[i].checked){
            Status = statusInput[i].value;
              break;
            }
        }

       bookObj.status = Status;

       Editing = false;
       editBookIdx = null;

       return true;
     

    }
    
}

function AddBookToLibrary() {

    let alreadyAdded = checkIfAdded();
    if(alreadyAdded){
        console.log("Already added")
        return;
    };

     let title = titleInput.value;
     let author = authorInput.value;
     let pages = pagesInput.value;
     let status;

     for(let i= 0; i<statusInput.length;i++) {
        if(statusInput[i].checked){
            status = statusInput[i].value;
            break;
        }
     }

     let newBook = new Book(title, author, pages, status);
     myLibrary.push(newBook);

}

function RemoveFromLibrary(index) {
    console.log("Inside Remove From Library");
   myLibrary.splice(index,1);
   addBookBtn.removeEventListener('click',RemoveFromLibrary);
   updateTable();
}

function EditTd(book,index) {
   let editTd = document.createElement('td');
   let editButton = document.createElement('button');
   editButton.textContent ='Edit';
   editButton.addEventListener('click',() => {
      titleInput.value = book.title;
      authorInput.value = book.author;
      pagesInput.value = book.pages;
      
      for(let i= 0; i<statusInput.length;i++) {
        if(statusInput[i].value == book.status){
            statusInput[i].checked = true;
            break;
        }
        else {
            statusInput[i].checked = false;
        }
     }
     Editing = true;
     editBookIdx = index;
     bookForm.style.display = 'flex';
    //  addBookBtn.addEventListener('click',RemoveFromLibrary)
   })

   editTd.appendChild(editButton);
   return editTd;
}

function deleteTd(index) {
    let deleteTd = document.createElement('td');
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click',() => {
       myLibrary.splice(index,1);
       updateTable();
    })
    deleteTd.appendChild(deleteButton);
    return deleteTd;
}

function changeStatusTd(book) {
   let statusTd = document.createElement('td');
   let statusButton = document.createElement('button');
   statusButton.textContent = 'Change Read Status';
   statusButton.addEventListener('click',() => {
        if(book.status == 'Not Read') {
            book.status = 'Completed';
        }
        else {
            book.status = 'Not Read';
        }
        updateTable()
   });

   statusTd.appendChild(statusButton);
   return statusTd

}

function updateTable() {
   libraryBooks.textContent = '';

   myLibrary.forEach(function(book,index){
    let tr = document.createElement('tr');
    for(let key in book){
        let td = document.createElement('td');
        td.textContent = book[key];
        tr.appendChild(td);
    }

    tr.appendChild(changeStatusTd(book));
    tr.appendChild(EditTd(book,index));
    tr.appendChild(deleteTd(index));
    libraryBooks.appendChild(tr);
   })
}


addBookBtn.addEventListener('click',() => {
   if( ValidateFormData() == false) return;
   AddBookToLibrary();
   updateTable();
   bookForm.style.display = 'none';
   ClearForm();
})

addBook.addEventListener('click',() => {
    ToggleBookForm(true);
})

closeFormBtn.addEventListener('click',() =>{
    ToggleBookForm(false);
})

updateTable();