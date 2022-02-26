// basit bir kitap bilgileri için kullandığım CLASS
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// Ekran ile ilgili işlemleri yapacağım CLASS
class UI {
  // yeni bir kitap girişi olduğunda bunu table'a ekleyen metot
  addBookToList(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    /*
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    `;
    */
    // bu for loop u ile yukarıdaki yapıyı oluşturuyorum. Yukarıdaki yapı da aynen kullanılabilir. Çünkü 3 alan (title, author ve isbn) var sadece.
    // Ancak alan sayısı fazla ise tek tek elle girmektense aşağıdaki gibi bir for loop ile sütünlar tek tek eklenebilir.
    // yukarıda önce bir tr oluştudum bunu da row değişkenine atadım.
    // bu for loop içinde sıra ile td elementlerini oluşturup row içine atacağım.
    for (let item of Object.keys(book)) {
      const td = document.createElement('td');
      td.innerHTML = book[item];
      row.appendChild(td);
    }
    // burada en son olarak delete işlemi için içinde X olan bir a tag i ekliyorum.
    const td = document.createElement('td');
    td.innerHTML = `<a href="#" class="delete">X</a>`;
    row.appendChild(td);

    // son olarak row un tamamını tabloya yeni satır olarak ekliyorum
    list.appendChild(row);
  }

  // form'daki giriş inputlarını sıfırlayan metot
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }

  // ekranda alert mesajları veren metot. bu kısım biraz detay. anlamakta zorlanırsanız buraya takılmayın.
  showAlert(message, className) {
    // yeni bir div oluşturuyorum
    const div = document.createElement('div');
    // verilmek istenen alert tipine göre class atıyorum div'e
    div.className = `alert ${className}`;

    div.innerHTML = message;
    // en dıştaki container'ı yakalıyorum
    const container = document.querySelector('.container');
    // bu container içindeki form u yakalıyorum
    const form = document.querySelector('#book-form');
    // container içindeki formun üstüne yeni oluşturduğum div'i ekliyorum
    container.insertBefore(div, form);
    // bu işlemden sonra 5 saniye sonra çalışak bir kod bırakıyorum.
    // bıraktığım kod 5 saniye sonra çalışaşak ve çalışınca da yeni eklediğim div i DOM'dan silecek
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 5000);
  }

  // tablodan kayıt silen metot
  deleteBook(target) {
    console.log(target);
    // target yani tıklama eventinin olduğu element delete butonu mu kontrol ediyorum
    if (target.className === 'delete') {
      // console.log(target.parentElement);
      // console.log(target.parentElement.parentElement);
      // delete button'u ise o zaman silme işlemi yapıyorum
      // satırı yani tr yi silmem lazım
      // <tr><td>Yüzüklerin Efendisi</td><td>Tolkiens</td><td>23412341234234</td><td><a href="#" class="delete">X</a></td></tr>
      // satır yapısı yukarıdaki gibi
      // benim target a, yani tıklamanın olduğu yer a tag'i
      // benim tr'ye ulaşmam lazım
      // target.parentElement ile td tag'ine ulaşırım. yetmez. bunun da üstüne çıkmam lazım. td nin bir üstü tr. o zaman hedef elementime ulaşırım
      // o yüzden target.parentElement.parentElement yapıyorum ve o elementi siliyorum.
      target.parentElement.parentElement.remove();
      return true;
    }
    return false;
  }
}

// uygulamam her çalıştığında kitap kayıtlarım silinmesin diye, girdiğim kitap bilgilerini kalıcı olarak tutsun diye Store CLASS ı tanımlıyorum
// bunun için browser'ın local storage özelliğini kullanacağım
// burada static metotlar kullandım.
// static metotlar instance oluşturmadan yani new Store deyip yeni bir object oluşturmadan, doğrudan Class'ın kendisi çağırıp metodu kullanmama izin verir.
// kayıt ekleme/silme/listeleme işlemleri için object oluşturmama gerek yok. Bu nedenle static kullanarak tanımlama yaptım.
class Store {
  // localStorage'daki kayıtları alan metot
  // localStorage.getItem('books') ile kayıtlarımı alabilirim ancak kayıt varsa bunun için bir dönüşüm yapmam lazım.
  // Oradan aldığım bilgileri JSON.parse() ile JavaScript object yapısına dönüştürüyorum.
  static getBooks() {
    let books;
    books =
      localStorage.getItem('books') === null
        ? []
        : JSON.parse(localStorage.getItem('books'));
    return books;
  }

  // localStorage'a yeni kitap ekleyen metot
  static addBook(book) {
    // ilk önce localStorage'taki mevcut kayıtları alıyorum
    const books = Store.getBooks();
    // aldığım kayıtların sonuna eklemek istediğim kitap bilgisi ekliyorum
    books.push(book);
    // localStorage.setItem komutu ile localStorage'a yazdırıyorum. Yine yazdırmadan önce bu sefer object tipini string yapısına dönüştürüyorum
    localStorage.setItem('books', JSON.stringify(books));
  }

  // localStorage'taki tüm kayıtları satır satır ekrana yazdıran metot
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }

  // localStorage'dan kayıt silen metot
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) books.splice(index, 1);
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// form submit olunca kayıt işlemini ve tabloya ekleme işlemini yapan eventListener
document.getElementById('book-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  // aldığım bilgileleri kullanarak yeni bir Book instance oluşturuyorum
  const book = new Book(title, author, isbn);

  // yeni bir ui instance oluşturuyorum
  const ui = new UI();

  // bilgiler boş geldi mi onu kontrol ediyorum
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Fields can not be empty', 'error');
  } else {
    // boş değilse, ui metodunu çağırarak ekrana ekleme yapıyorum
    ui.addBookToList(book);
    // Store class üzerindeki kayıt metodunu çağırıyorum
    Store.addBook(book);

    ui.clearFields();

    ui.showAlert('Book successfully added', 'success');
  }
});

// silme işlemini yapan eventlistener
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  const isDeleted = ui.deleteBook(e.target);

  if (isDeleted) ui.showAlert('Book removed!', 'success');
});

// sayfam ilk yüklendiğinde, Store class'ımın display metodunu çağırarak kayıtlı kitapları ekrana getiriyorum
document.addEventListener('DOMContentLoaded', Store.displayBooks);
