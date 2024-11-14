import '../../../styles/index.scss';
import dominosArray from './data/dominos.json';
import kfcArray from './data/kfc.json';
import macArray from './data/mac.json';

class Dish {
    #count = 0;

    constructor (id, price, title, img, count) {
        this.id = id;
        this.price = price;
        this.title = title;
        this.img = img;
        this.#count = count;
    }

    getCount() {
        return this.#count;
    }

    setCount(number) {
        if(isNaN(Number(number))) throw new Error(`Argument is not a number`);
        if(number < 0) throw new Error(`Argument less than zero`);

        this.#count = number;
    }
}

const dominos = dominosArray.map((item)=> new Dish(item.id, item.price, item.title, item.img, item.count));
const kfc = kfcArray.map((item)=> new Dish(item.id, item.price, item.title, item.img, item.count));
const mac = macArray.map((item)=> new Dish(item.id, item.price, item.title, item.img, item.count));
const markUps = [dominos, mac, kfc];
let currentMarkUp = [];

const dishesLayout = document.getElementsByClassName('dish');
const featuredItems = document.getElementsByClassName('featured')[0].children;
let [dominosBtn, kfcBtn, macBtn] = featuredItems;

let badgeBtn = document.getElementsByClassName('icon-button--orange')[0];
let badgeCounter = badgeBtn.getElementsByTagName('span')[0];

const drawer = document.getElementsByClassName('overlay')[0];
const closeBtn = drawer.getElementsByClassName('icon-button')[0];
const addMoreBtn = drawer.getElementsByClassName('add-more')[0];
closeBtn.addEventListener('click', (event) => {
    drawer.classList.remove('visible');
});
badgeBtn.addEventListener('click', (event) => {
    drawer.classList.add('visible');
    gatherOrders();
    ordersToDrawer();
});
addMoreBtn.addEventListener('click', (event)=> {
    drawer.classList.remove('visible');
});

let checkout = drawer.getElementsByClassName('button')[0];
checkout.onclick = () => {
    orderHistory.forEach(value => {
        let now = new Date();
        value.checkout = now.toISOString();
    });
    localStorage.setItem('orders', JSON.stringify(orderHistory));
    document.location.href = 'orders.html';
};

let order = document.createElement('div');
order.classList.add('order');
addMoreBtn.before(order);

let orderHistory = [
    {
        restaurant: "Domino’s Pizza",
        checkout: '',
        orders: []
    },
    {
        restaurant: "McDonald’s",
        checkout: '',
        orders: []
    },
    {
        restaurant: 'KFC',
        checkout: '',
        orders: []
    }
];

function dynamicMarcUp(arr) {    
    for (let i = 0; i<dishesLayout.length; i++) {
        dishesLayout[i].setAttribute('id', `dish-${i+1}`);
        dishesLayout[i].querySelector('.dish__image').setAttribute('src', arr[i].img);
        dishesLayout[i].querySelector('.dish__title').innerHTML = `${arr[i].title}`;
        dishesLayout[i].querySelector('.dish__price').innerHTML = `${arr[i].price} ₴`;

        if (sessionStorage.getItem(arr[i].title)){
            let savedCount = JSON.parse(sessionStorage.getItem(arr[i].title)).count;
            dishesLayout[i].querySelector('.counter__number').innerHTML = savedCount;
        } else {
            dishesLayout[i].querySelector('.counter__number').innerHTML = '';
        }

        if (dishesLayout[i].querySelector('.counter__number').innerHTML === '') {
            dishesLayout[i].querySelector('.counter__button--decrease').style = 'display: none';
        } else {
            dishesLayout[i].querySelector('.counter__button--decrease').style = 'display: inherit';
        }
    }
    currentMarkUp = arr;
};

function toActive(elem) {
    for (let i = 0; i<featuredItems.length; i++) {
        featuredItems[i].classList.remove('active');
    }
    elem.classList.add('active');
};

function finalizeButtons() {
    for (let i = 0; i<dishesLayout.length; i++) {
        if(!dishesLayout[i].querySelector('.counter__button--decrease')) {
            let minus = document.createElement('button');
                minus.classList.add('counter__button');
                minus.classList.add('counter__button--decrease');
                minus.style = 'display: none';
                
            dishesLayout[i].querySelector('.counter__button--increase').before(minus);
        } else dishesLayout[i].querySelector('.counter__button--decrease').style = 'display: none';

        if(!dishesLayout[i].querySelector('.counter__number')){
            let counter__number = document.createElement('span');
            counter__number.classList.add('counter__number');
            dishesLayout[i].querySelector('.counter__button--increase').before(counter__number);
        } else dishesLayout[i].querySelector('.counter__number').innerHTML = '';
    }
}

function createOrderItem(obj, index) {
    let item = document.createElement('div');
    item.classList.add('order__item');
    item.classList.add('order-item');
    item.setAttribute('id', `order-${obj.id}-${index}`);

    let img = document.createElement('img');
    img.classList.add('order-item__image');
    img.setAttribute('src', `${currentMarkUp[obj.id-1].img}`);
    item.append(img);

    let count = document.createElement('span');
    count.classList.add('order-item__quantity');
    count.innerHTML = `${obj.count} x`;
    item.append(count);

    let orderInfo = document.createElement('div');
    orderInfo.classList.add('order-item__info');

        let title = document.createElement('h3');
        title.innerHTML = `${obj.title}`;

        let price = document.createElement('div');
        price.innerHTML = `${obj.price} грн`;

        orderInfo.append(title);
        orderInfo.append(price);

    item.append(orderInfo);

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('icon-button');
    deleteBtn.classList.add('icon-button--red');
    deleteBtn.setAttribute('id', `order-${obj.id}-${index}`);

        let deleteImg = document.createElement('img');
        deleteImg.setAttribute('src', "img/icons/delete.svg");
        deleteImg.setAttribute('alt', "");

        deleteBtn.append(deleteImg);
    
    deleteBtn.addEventListener('click', (event)=> {
        sessionStorage.removeItem(obj.title);
        document.getElementById(`order-${obj.id}-${index}`).remove();
        let newOrders = [];
        orderHistory[index].orders.forEach(value => {
            console.log(document.getElementById(`order-${value.id}-${index}`));            
            if(document.getElementById(`order-${value.id}-${index}`) !== null) {
                newOrders.push(value);
            }
        });
        orderHistory[index].orders = newOrders;
        console.log(orderHistory);
        badgeCounter.innerHTML = sessionStorage.length;
        document.getElementById(`dish-${obj.id}`).querySelector('.counter__number').innerHTML = '';
        document.getElementById(`dish-${obj.id}`).querySelector('.counter__button--decrease').style = 'display: none';
        for(item of drawer.getElementsByClassName('order')[0].childNodes){
            if(item.querySelector('div').childElementCount === 0){
                item.remove();
            }
        }
    });
    
    item.append(deleteBtn);

    return item;
}

function ordersToDrawer() {
    let title = document.createElement('h3');
    title.classList.add('title');

    let orderList = document.createElement('div');

    switch (currentMarkUp) {
        case dominos:
            if(orderHistory[0].orders.length > 0){
                if(order.querySelector('.dominos') === null){
                    let orderItem = document.createElement('div');
                    orderItem.classList.add('dominos');
                    title.innerHTML = 'Dominos Pizza';
                    orderItem.append(title);
                    orderList.classList.add('dominos-list');
                    order.append(orderItem);
                    orderItem.append(orderList);
                }
                orderHistory[0].orders.forEach((value, index) => {
                    if(!document.getElementById(`order-${value.id}-0`)) {
                        orderList.append(createOrderItem(value, 0));
                    }
                });
                
            }
            break;

        case mac:
            if(orderHistory[1].orders.length > 0){
                if(order.querySelector('.mac') === null){
                    let orderItem = document.createElement('div');
                    orderItem.classList.add('mac');
                    title.innerHTML = "Mc Donald's";
                    orderItem.append(title);
                    orderList.classList.add('mac-list');
                    order.append(orderItem);
                    orderItem.append(orderList);
                }
                orderHistory[1].orders.forEach((value, index) => {
                    if(!document.getElementById(`order-${value.id}-1`)) {
                        orderList.append(createOrderItem(value, 1));
                    }
                });
            }
            break;

        case kfc:
            if(orderHistory[2].orders.length > 0){
                if(order.querySelector('.kfc') === null){
                    let orderItem = document.createElement('div');
                    orderItem.classList.add('kfc');
                    title.innerHTML = 'KFC';
                    orderItem.append(title);
                    orderList.classList.add('kfc-list');
                    order.append(orderItem);
                    orderItem.append(orderList);
                }
                orderHistory[2].orders.forEach((value, index) => {
                    if(!document.getElementById(`order-${value.id}-2`)) {
                        orderList.append(createOrderItem(value, 2));
                    }
                });
            }
            break;
    }
}

function gatherOrders() {
    let keys = [];
    for (let i = 0; i<sessionStorage.length; i++) {
        keys.push(sessionStorage.key(i));
    }

    let titles = [];
    currentMarkUp.forEach((value)=>{
        titles.push(value.title);
    });

    switch (currentMarkUp) {
        case dominos:
            orderHistory[0].orders = [];
            for (let i = 0; i<sessionStorage.length; i++) {
                if (titles.includes(sessionStorage.key(i))){
                    orderHistory[0].orders.push(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
                }
            }
            break;

        case mac:
            orderHistory[1].orders = [];
            for (let i = 0; i<sessionStorage.length; i++) {
                if (titles.includes(sessionStorage.key(i))){
                    orderHistory[1].orders.push(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
                }
            }
            break;

        case kfc:
            orderHistory[2].orders = [];
            for (let i = 0; i<sessionStorage.length; i++) {
                if (titles.includes(sessionStorage.key(i))){
                    orderHistory[2].orders.push(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
                }
            }
            break;
    }
    localStorage.setItem('orders', JSON.stringify(orderHistory));
}
    
function eventPlusButtons() {
    for (let i = 0; i<dishesLayout.length; i++) {
        dishesLayout[i].querySelector('.counter__button--increase').addEventListener('click', (event)=> {
            let prevVal = Number(dishesLayout[i].querySelector('.counter__number').innerHTML);
            dishesLayout[i].querySelector('.counter__number').innerHTML = `${prevVal+=1}`;
            dishesLayout[i].querySelector('.counter__button--decrease').style = 'display: inherit';

            let idToAdd = Number(dishesLayout[i].id.slice(-1))-1;
            let objToAdd = { id : currentMarkUp[idToAdd].id,
                title : currentMarkUp[idToAdd].title, 
                price : currentMarkUp[idToAdd].price, 
                count : currentMarkUp[idToAdd].getCount() + 1
            };

            idToAdd = objToAdd.title;            

            if(!sessionStorage.getItem(idToAdd)){
                sessionStorage.setItem(idToAdd, JSON.stringify(objToAdd));
            } else {
                objToAdd.count = JSON.parse(sessionStorage.getItem(idToAdd)).count + 1;
                sessionStorage.setItem(idToAdd, JSON.stringify(objToAdd));              
            }

            badgeCounter.innerHTML = sessionStorage.length;
        });
    }
}

function eventMinusButtons() {
    for (let i = 0; i<dishesLayout.length; i++) {
        dishesLayout[i].querySelector('.counter__button--decrease').addEventListener('click', (event)=> {
            let prevVal = Number(dishesLayout[i].querySelector('.counter__number').innerHTML);
            dishesLayout[i].querySelector('.counter__number').innerHTML = `${prevVal-=1}`;

            if(prevVal<=0) {
                dishesLayout[i].querySelector('.counter__button--decrease').style = 'display: none';
                dishesLayout[i].querySelector('.counter__number').innerHTML = '';
            };

            let idToRemove = dishesLayout[i].querySelector('.dish__title').innerHTML;
            let objToRemove = JSON.parse(sessionStorage.getItem(idToRemove));

            if(JSON.parse(sessionStorage.getItem(idToRemove)).count > 0){
                objToRemove.count = JSON.parse(sessionStorage.getItem(idToRemove)).count - 1;
                sessionStorage.setItem(idToRemove, JSON.stringify(objToRemove));
            }

            if (JSON.parse(sessionStorage.getItem(idToRemove)).count === 0){
                sessionStorage.removeItem(idToRemove);
            }

            badgeCounter.innerHTML = sessionStorage.length;
        });
    }

}

window.addEventListener('load', (event) => {
    finalizeButtons();
    eventPlusButtons();
    eventMinusButtons();

    badgeCounter.innerHTML = sessionStorage.length;

    for (let i = 0; i<featuredItems.length; i++) {
        featuredItems[i].setAttribute('id', i+1);
    };

    for (let button of [dominosBtn, macBtn, kfcBtn]) {
        button.addEventListener('click', (event)=> {
            dynamicMarcUp(markUps[button.id-1]);
            toActive(button);
        });
    };

    dynamicMarcUp(dominos);
    toActive(dominosBtn);
    currentMarkUp = dominos;
});
