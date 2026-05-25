let data = {};
let listData = localStorage
                .getItem('storageList') ?
                JSON
                .parse(localStorage
                .getItem('storageList')) : [];

function updateRating (value) { // вытаскиваем значение из ползунка в отдельный контейнер над ним, а так же привязываем его
    document
        .querySelector('.rating-value')
        .textContent = parseFloat(value).toFixed(1);
}
document.querySelector('.rating').addEventListener('input', e => updateRating(e.target.value));

function formData () { //Достаем данные из полей и складываем в объект, заодно проверяем формат новых данных
    let title = document
                .querySelector('.name')
                .value
                .trim();
    if (!title) {
        alert('Напишите название фильма!')
        return;
    }

    let year = document
                .querySelector('.date')
                .valueAsNumber;
    if (!year) {
        alert('Укажите год выпуска фильма!')
        return;
    }

    let genres = document
                .querySelector('.genre')
                .value
                .trim()
                .toLowerCase()
                .split(/,\s*/);
    if (genres.length === 0) {
        alert('Напишите жанры фильма!')
        return;
    }

    let rating = document
                .querySelector(".rating")
                .valueAsNumber;
    if (!rating) {
        alert('Укажите рейтинг фильма!')
        return;
    }

    let watched = Boolean(document
                .querySelector(".viewed")
                .checked);
    let comment = document
                .querySelector(".comment")
                .value
                .trim();
    if (!comment) {
        alert('Напишите комментарий!')
        return;
    }
    let id = data.id ?? Math.floor(Math.random() * 10000);
    let check = listData.findIndex(e => e.id === data.id); //Проверка на наличие такого же элемента в массиве по id, чтобы не добавить дубль, а перезаписать старый
    let createdAt = data.createdAt ?? new Date().toLocaleDateString('ru-RU');
    let updatedAt = new Date().toLocaleDateString('ru-RU');

    data = {
        id,
        title,
        year,
        genres,
        rating,
        watched,
        comment,
        createdAt,
        updatedAt
    };

    if (check !== -1) {
        listData[check] = data;
    } else {
        listData.push(data);
    }
    return true;
}

function clearData () { //функция очистки полей и данных
    document.querySelector('.name').value = '';
    document.querySelector('.date').value = '';
    document.querySelector('.genre').value = '';
    document.querySelector('.rating').value = '0';
    updateRating(0);
    document.querySelector('.viewed').checked = false;
    document.querySelector('.comment').value = '';
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
    handler();
}

setInterval(syncData, 300000);

function deleteElement (id) { // функция кнопок удалить и для массива и для формы/ удаляем элемент по id
    listData = listData.filter(element => element.id !== id);
    if (data.id === id) {
        clearData();
    }
    syncData ();
}

function selectElement (id) { // функция выбора элемента из массива - достали данные и заполнили поля + прокинули id  в удаление
    let selectedFilm = listData.find( element => element.id === id);

    document.querySelector('.name').value = selectedFilm.title;
    document.querySelector('.date').valueAsNumber = selectedFilm.year;
    document.querySelector('.genre').value = selectedFilm.genres;
    updateRating(selectedFilm.rating);
    document.querySelector('.rating').value = selectedFilm.rating;
    document.querySelector('.viewed').checked = selectedFilm.watched;
    document.querySelector('.comment').value = selectedFilm.comment;
    data.id = selectedFilm.id;
    data.createdAt = selectedFilm.createdAt;
    document.querySelector('.deleteButton').setAttribute('onclick',`deleteElement(${id})`);
}


function searchData (data) { // функция поиска - тянем значение из поля и по нему фильтруем общий массив, а затем передаем это функции отрисовки
    let searchDataValue = document.querySelector('.search').value;
    if (!searchDataValue) return data;
    return data.filter( e => e.title.includes(searchDataValue) || e.comment.includes(searchDataValue));
}
document.querySelector('.search').addEventListener('input' , handler);


function filterData (data) { // фильтр по просмотрам И жанрам - считываем значения селектора и инпута, присваиваем значения на булевые и фильтруем массив соотвественно
    let viewDataValue = document.querySelector('.view-filter').value;
    let genresSearchInput = document.querySelector('.genreFilter').value.trim().toLowerCase();
    
    return data.filter( e => {
        let viewFilter = true;
   
        if (viewDataValue === 'viewed') {viewFilter = e.watched === true;}
        if (viewDataValue === 'not-viewed')  {viewFilter = e.watched === false;}

        let genresFilter = true;
        if (genresSearchInput !== '') {
            genresFilter = e.genres.some( e => e.includes(genresSearchInput));
        }
        return viewFilter && genresFilter;
        });
}
document.querySelector('.view-filter').addEventListener('change', handler);
document.querySelector('.genreFilter').addEventListener('input', handler);

function sortData (data) { //функция сортировки данных по селекту
 let sortFlag = document.querySelector('.sort-filter').value;
 let sortedData = [...data];

 switch (sortFlag) {
    case'yearUp' :
    return sortedData.sort((a,b) => b.year - a.year);
    case'yearDown' :
    return sortedData.sort((a,b) => a.year - b.year);
    case 'ratingUp' :
    return sortedData.sort((a,b) => b.rating - a.rating);
    case 'ratingDown' :
    return sortedData.sort((a,b) => a.rating - b.rating);
    default:
 return sortedData;
 }
}
document.querySelector('.sort-filter').addEventListener('change', handler);


function handler () { //хэндлер который создает тэмп и вызывает все функции сортировки
    let temp = listData;

    temp = searchData(temp);
    temp = filterData(temp);
    temp = sortData(temp);

    setList(temp);
}

function setList (data) { // функция отрисовки списка - берем массив данных и создаем элемент списка для каждого
    const listContainer = document.querySelector('.filmList');
    listContainer.innerHTML = data.map(element => {
        return `<li id=${element.id} onclick="selectElement(${element.id})">${element.title}</li><button onclick="deleteElement(${element.id})">Удалить</button>`;
    }).join('');
}

function exportJSON () { //функция экспорта жсон, создаем временную ссылку чтобы на нее кликнуть и скачать файл
    if (!listData) {
        alert ('Нет данных!');
        return;
    }
    let dataToJSON = JSON.stringify(listData);
    let blob = new Blob([dataToJSON], {type : 'application/json'});
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = 'filmsJSON';
    link.click();
    URL.revokeObjectURL(url);
}

function importJSON (e) { //импорт жсон файла, создаем внутренний ридер и вызываем метод ридера при загрузке
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
            let importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) {
                alert('Файл должен содержать массив фильмов!');
                return;
            }
            listData = importedData;
            localStorage.setItem('storageList', JSON.stringify(listData));
            handler();
            e.target.value = '';
    }
    reader.readAsText(file);
}
document.querySelector('.importButton').addEventListener('change',importJSON);

handler();