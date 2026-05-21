let data = {};  // инициализируем объект данных
let listData = localStorage.getItem('storageList') ? JSON.parse(localStorage.getItem('storageList')) : [];   // достаем данные из хранилища, либо присваем пустой массив если их нет

function updateRating (value) {   // вытаскиваем значение из ползунка в отдельный контейнер над ним, а так же привязываем его
    document.getElementById('rating-value').textContent = parseFloat(value).toFixed(1);
}
document.getElementById('rating').addEventListener('input', e => updateRating(e.target.value));

function formData () {                    //Достаем данные из полей и складываем в объект, заодно проверяем формат новых данных
    let title = document                   // название фильма
                .getElementById('name')
                .value
                .trim();
    if (!title) {
        alert('Напишите название фильма!')
        return;
    }

    let year = document                     // год создания
                .getElementById('date')
                .valueAsNumber;
    if (!year) {
        alert('Укажите год выпуска фильма!')
        return;
    }

    let genres = document                     // здесь берем жанры и превращаем в массив
                .getElementById('genre')
                .value
                .trim()
                .toLowerCase()
                .split(/,\s*/);
    if (genres.length === 0) {
        alert('Напишите жанры фильма!')
        return;
    }

    let rating = document                      // считываем данные ползунка рейтинга
                .getElementById("rating")
                .valueAsNumber;
    if (!rating) {
        alert('Укажите рейтинг фильма!')
        return;
    }

    let watched = Boolean(document                 // галочка просмотра
                .getElementById("viewed")
                .checked);
    let comment = document                         // тащим текст комментария
                .getElementById("comment")
                .value
                .trim();
    if (!comment) {
        alert('Напишите комментарий!')
        return;
    }
    let id = data.id ?? Math.floor(Math.random() * 10000); //Проверяем есть ли уже id у элемента, если нет - присваиваем новый
    let createdAt = data.createdAt ?? new Date().toLocaleDateString('ru-RU');     // присваеваем или перезаписываем дату создания

    data = {           //формируем объект из всех данных
        id,
        title,
        year,
        genres,
        rating,
        watched,
        comment,
        createdAt
    };

    let check = listData.findIndex(e => e.id === data.id);  //Проверка на наличие такого же элемента в массиве по id, чтобы не добавить дубль, а перезаписать старый

    if (check !== -1) {
        listData[check] = data;  // перезапись существующего элемента по найденному индексу
    } else {
        listData.push(data);  // добавляем новый элемент
    }

    return true;
}

function clearData () {             //функция очистки полей и данных
    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('rating').value = '0';
    updateRating(0);
    document.getElementById('viewed').checked = false;
    document.getElementById('comment').value = '';
    data = {};
}

function saveData () { // функция кнопки сохранить, проверяем данные => сохраняем => обновляем список => очищаем поля
    if(formData()) {
        syncData();
        clearData();
    }
}

function syncData () { // повторяющаяся функция обновления данных - сохраняем и обновляем список
    localStorage.setItem('storageList', JSON.stringify(listData));
    setList(listData);
}

function deleteElement (id) { // функция кнопок удалить и для массива и для формы/ удаляем элемент по id
    listData = listData.filter(element => element.id !== id);
    if (data.id === id) {
        clearData();
    }
    syncData ();
}

function selectElement (id) {    // функция выбора элемента из массива - достали данные и заполнили поля + прокинули id  в удаление
    let selectedFilm = listData.find( element => element.id === id);

    document.getElementById('name').value = selectedFilm.title;
    document.getElementById('date').valueAsNumber = selectedFilm.year;
    document.getElementById('genre').value = selectedFilm.genres;
    updateRating(selectedFilm.rating);
    document.getElementById('rating').value = selectedFilm.rating;
    document.getElementById('viewed').checked = selectedFilm.watched;
    document.getElementById('comment').value = selectedFilm.comment;
    data.id = selectedFilm.id;
    document.getElementById('deleteButton').setAttribute('onclick',`deleteElement(${id})`);
}


function searchData () {                       // функция поиска - тянем значение из поля и по нему фильтруем общий массив, а затем передаем это функции отрисовки
    let searchDataValue = document.getElementById('search').value;
    let searchedData = listData.filter( e => e.title.includes(searchDataValue) || e.comment.includes(searchDataValue));
    setList(searchedData);
}
document.getElementById('search').addEventListener('input' , searchData);


function filterData () {                       // фильтр по просмотрам И жанрам - считываем значения селектора и инпута, присваиваем значения на булевые и фильтруем массив соотвественно
    let viewDataValue = document.getElementById('view-filter').value;
    let genresSearchInput = document.getElementById('genreFilter').value.trim().toLowerCase();
    
    let filteredData = listData.filter( e => {
        let viewFilter = true;

        if (viewDataValue === 'every') {viewFilter = true;}    
        if (viewDataValue === 'viewed') {viewFilter = e.watched === true;}
        if (viewDataValue === 'not-viewed')  {viewFilter = e.watched === false;}

        let genresFilter = true;
        if (genresSearchInput !== '') {
            genresFilter = e.genres.some( п => п.includes(genresSearchInput));       //если просто воткнуть includes то он ищет только строгое соответствие
        }
        return viewFilter && genresFilter;
        });
    setList(filteredData);
}
document.getElementById('view-filter').addEventListener('change', filterData);
document.getElementById('genreFilter').addEventListener('input', filterData);

function setList (data) {                             // функция отрисовки списка - берем массив данных и создаем элемент списка для каждого
    const listContainer = document.getElementById('filmList');
    listContainer.innerHTML = data.map(element => {
        return `<li id=${element.id} onclick="selectElement(${element.id})">${element.title}</li><button onclick="deleteElement(${element.id})">Удалить</button>`;
    }).join('');
    console.log(data);
}
setList(listData);