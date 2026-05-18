let data = {};
let listData = [];

let ratingInput = document.getElementById('rating');
let ratingValue = document.getElementById('rating-value');


function updateRating (value) {
    ratingValue.textContent = parseFloat(value).toFixed(1);
}
ratingInput.addEventListener('input', e => updateRating(e.target.value));

function formData () {
    let id = Math.floor(Math.random() * 10000);
    let title = document.getElementById('name').value;
    if (typeof title !== 'string') {
        alert ('Название фильма должно быть строкой!')
    }
    let year = Number(document.getElementById('date').value.replaceAll('-',''));
    if (typeof year !== 'number' || Number.isNaN(year)) {
        alert ('Год должен быть числом!')
    }
    let genres = document.getElementById('genre').value.split(/,\s*/);
    if (!Array.isArray(genres) && genres.every(e => typeof e === 'string')) {
        alert ('Жанры должны быть массивом строк!')
    }
    let rating = document.getElementById("rating").valueAsNumber;
    if (typeof rating !== 'number' || Number.isNaN(rating)) {
        alert ('Кажется все сломалось')
    }
    let watched = Boolean(document.getElementById("viewed").checked);
    let comment = document.getElementById("comment").value;
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
    console.log(data);
}

function saveData () {
    formData()
    listData.push(data);
    console.log(listData);
}