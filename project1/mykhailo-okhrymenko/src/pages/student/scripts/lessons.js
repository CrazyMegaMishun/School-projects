import {timeSlots, lessons} from './constants';

let bookBtn = document.querySelectorAll('button[type="submit"]')[1];
bookBtn.addEventListener('click', (event)=> {
    event.preventDefault();

    let checked = document.querySelectorAll('input[type="radio"]:checked');
    
    let lesson ={
        name: JSON.parse(localStorage.getItem('login')).name,
        time: '',
        tomorrow: '',
        title: '',
        duration: ''
    };

    for (let item of checked) {
        let idToFind = item.id;
        switch (item.name) {
            case 'time':
                lesson.time = timeSlots[idToFind];
                lesson.tomorrow = ['time_04', 'time_05', 'time_06'].includes(idToFind) ? true : false;
                console.log(['time_04', 'time_05', 'time_06'].includes(idToFind));
                break;
            case 'type' :
                lesson.title = lessons[idToFind].title;
                lesson.duration = lessons[idToFind].duration;
                break;
        }
    }
    
    if(JSON.parse(localStorage.getItem('lessons')) === null){
        localStorage.setItem('lessons', JSON.stringify([lesson]));
    }else {
        let rows = [];
        rows = JSON.parse(localStorage.getItem('lessons'));
        rows.push(lesson);
        localStorage.setItem('lessons', JSON.stringify(rows));
    }
});
