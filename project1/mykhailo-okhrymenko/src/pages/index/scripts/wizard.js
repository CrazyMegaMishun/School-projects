import { saveToStorage } from './login';

const loginBlock = document.getElementById('loginBlock');
const step1Block = document.getElementById('step1Block');
const regBlock = document.getElementById('regBlock');
const pattern = new RegExp("^[A-Za-z0-9][A-Za-z0-9\.-\_]*[A-Za-z0-9]*@([A-Za-z0-9]+([A-Za-z0-9-]*[A-Za-z0-9]+)*\.)+[A-Za-z]*$");

let user = {
    type: 'student',
    name: '',
    email: '',
    password: null
};

let regBtn = document.getElementById('regBtn');
regBtn.addEventListener('click', (event) =>{
    loginBlock.style.display = 'none';
    step1Block.style.display = 'flex';
});

let toStep2Btn = document.getElementById('toStep2Btn');
toStep2Btn.addEventListener('click', (event)=>{
    step1Block.style.display = 'none';
    regBlock.style.display = 'flex';

});

let from1to2 = document.getElementById('from1to2');
from1to2.addEventListener('click', (event)=>{
    step1Block.style.display = 'none';
    regBlock.style.display = 'flex';
});

let from2to1 = document.getElementById('from2to1');
from2to1.addEventListener('click', (event)=>{
    step1Block.style.display = 'flex';
    regBlock.style.display = 'none';
});

let toLoginSvg = document.getElementById('toLoginSvg');
toLoginSvg.addEventListener('click', (event) =>{
    step1Block.style.display = 'none';
    loginBlock.style.display = 'flex';
});

let from3to2Svg = document.getElementById('from3to2Svg');
from3to2Svg.addEventListener('click', (event) =>{
    regBlock.style.display = 'none';
    step1Block.style.display = 'flex';
});

let user_student = document.getElementById('user_student');
user_student.addEventListener('click', (event)=>{
    user.type = 'student';
});

let user_teacher = document.getElementById('user_teacher');
user_teacher.addEventListener('click', (event)=>{
    user.type = 'teacher';
});

let userName = document.getElementById('name');
userName.addEventListener('change', (event)=>{
    try{
        if(userName.value.split(' ')[0].length <= 3 || userName.value.split(' ')[1].length <= 3){
            alert('Name is not valid');
            userName.classList.add('error');
        } else {
            if(userName.classList.contains('error')) userName.classList.remove('error'); //userName.removeAttribute('error');
            user.name = userName.value;
        }
    } catch (e){
        alert('Name is not valid');
        userName.classList.add('error');
    }

});

let email = document.getElementById('email');
email.addEventListener('change', (event) =>{
    if(pattern.test(email.value)){
        if(email.classList.contains('error')) email.classList.remove('error');
        user.email = email.value;
    } else {
        alert('E-mail is not valid');
        email.classList.add('error');
        email.value = '';
    }
});

let password = document.getElementById('password');
password.addEventListener('change', (event) =>{
    user.password = password.value;
});

let password_next = document.getElementById('password_next');
password_next.addEventListener('change', (event) =>{
    if (password_next.value !== user.password){
        password.classList.add('error');
        password_next.classList.add('error');
        user.password = '';
        password.value = '';
        password_next.value = '';
        alert("Paswords doesn't match");
    } else {
        if(password.classList.contains('error')) {
            password.classList.remove('error');
            password_next.classList.remove('error');
        }
        user.password = password_next.value;
    }
});

let createAccount = document.getElementById('createAccount');
createAccount.addEventListener('click', (event) =>{
    if(userName.value === '' ||
        email.value === '' ||
        password.value === '' ||
        password_next.value === ''){
            alert('Write down info please');
    }else {
        switch (user.type){
            case 'teacher': {
                saveToStorage(user);
                localStorage.setItem('teacher', JSON.stringify([user]));
                window.location.href = 'teacher.html';
            }
            case 'student': {
                if(JSON.parse(localStorage.getItem('student')) === null){
                    localStorage.setItem('student', JSON.stringify([user]));
                }else {
                    let rows = [];
                    rows = JSON.parse(localStorage.getItem('student'));
                    rows.push(user);
                    localStorage.setItem('student', JSON.stringify(rows));
                }
                saveToStorage(user);
                window.location.href = 'student.html';
            }
        }
    }
});