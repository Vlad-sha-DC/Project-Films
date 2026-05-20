let data = {};
let listData = localStorage.getItem('storageList') ? JSON.parse(localStorage.getItem('storageList')) : [];

let ratingInput = document.getElementById('rating');
let ratingValue = document.getElementById('rating-value');


function updateRating (value) {
    ratingValue.textContent = parseFloat(value).toFixed(1);
}
ratingInput.addEventListener('input', e => updateRating(e.target.value));

function formData () {
    let title = document
                .getElementById('name')
                .value
                .trim();
    if (!title) {
        alert('Напишите название фильма!')
        return;
    }
    // if (typeof title !== 'string') {
    //     alert ('Название фильма должно быть строкой!')
    // }
    let year = parseInt(document
                    .getElementById('date')
                    .value);
    if (!year) {
        alert('Укажите год выпуска фильма!')
        return;
    }
    // if (typeof year !== 'number' || Number.isNaN(year)) {
    //     alert('Год должен быть числом!')
    // }
    let genres = document
                .getElementById('genre')
                .value
                .split(/,\s*/);
    if (genres.length === 0) {
        alert('Напишите жанры фильма!')
        return;
    }
    // if (!Array.isArray(genres) && genres.every(e => typeof e === 'string')) {
    //     alert('Жанры должны быть массивом строк!')
    // }
    let rating = document
                .getElementById("rating")
                .valueAsNumber;
    if (!rating) {
        alert('Укажите рейтинг фильма!')
        return;
    }
    // if (typeof rating !== 'number' || Number.isNaN(rating)) {
    //     alert('Кажется все сломалось')
    // }
    let watched = Boolean(document
                        .getElementById("viewed")
                        .checked);
    let comment = document
                .getElementById("comment")
                .value
                .trim();
    if (!comment) {
        alert('Напишите комментарий!')
        return;
    }
    let id = Math.floor(Math.random() * 10000);
    let createdAt = new Date().toLocaleDateString('ru-RU');
    data = {
        id,
        title,
        year,
        genres,
        rating,
        watched,
        comment,
        createdAt
    };
    listData.push(data);
    return true;
}

function clearData () {
    document.getElementById('name').value = '';
    document.getElementById('date').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('rating').value = '';
    updateRating(0);
    document.getElementById('viewed').checked = false;
    document.getElementById('comment').value = '';
    data = {};
}

function saveData () {
    if(formData()) {
        syncData();
        clearData();
    }
}

function syncData () {
    localStorage.setItem('storageList', JSON.stringify(listData));
    setList(listData);
}

let deleteElement = function (id) {
    listData = listData.filter(element => element.id !== id);
    syncData ();
}

function setList (listData) {
    const listContainer = document.getElementById('filmList');
    listContainer.innerHTML = listData.map(element => {
        return `<li id=${element.id}>${element.title}</li><button onclick="deleteElement(${element.id})">Удалить</button>`;
    }).join('');
}
setList(listData);