let titleText = document.querySelector("#title");
let authorText = document.querySelector("#author");
let isbnText = document.querySelector("#isbn");
let submitButton = document.getElementsByTagName("input")[3];
let listArea = document.querySelector("#book-list");


submitButton.addEventListener("click", (e)=>{
    e.preventDefault();
    if (titleText.value === '' || authorText.value === '' || isbnText.value === '') {
        alert('Fields can not be empty', 'error');
    } else {
    let newRow = document.createElement("tr");

    let titleList = document.createElement("td");
    titleList.classList.add("titleList");
    // listArea.appendChild(titleList);
    newRow.appendChild(titleList);
    titleList.innerText= titleText.value;

    let authorList = document.createElement("td");
    authorList.classList.add("authorList");
    // listArea.appendChild(authorList);
    newRow.appendChild(authorList);
    authorList.innerText += authorText.value;

    let isbnList = document.createElement("td");
    isbnList.classList.add("isbnList");
    // listArea.appendChild(isbnList);
    newRow.appendChild(isbnList);
    isbnList.innerText += isbnText.value;

    let deletebutton = document.createElement("button");
    deletebutton.innerHTML = `<a href="#" class="remove">X</a>`;
    deletebutton.classList.add("remove");
    // isbnList.appendChild(deletebutton);
    newRow.appendChild(deletebutton);

    listArea.appendChild(newRow);
    }

    titleText.value = '';
    authorText.value = '';
    isbnText.value = '';
})

//remove book list
listArea.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove")) {
      event.target.parentElement.parentElement.remove();
    }
  });
  

