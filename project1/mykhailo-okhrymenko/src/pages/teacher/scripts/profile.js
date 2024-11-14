export const user = JSON.parse(localStorage.getItem('login')) || {
    email: 'jdoe@lectrum.io',
    name: 'John Dou (default)'
};

const headerTitle = document.getElementById('headerTitle');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

headerTitle.innerHTML = user.name;
userName.innerHTML = user.name;
userEmail.innerHTML = user.email;