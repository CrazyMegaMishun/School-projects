import '../../../styles/index.scss';
import moment from 'moment/moment';

class Checkout {
    #orders;
    #checkoutTime;
    #restaurant;

    constructor (orders, checkoutTime, restaurant) {
        this.#orders = orders;
        this.#checkoutTime = checkoutTime;
        this.#restaurant = restaurant;
        this.ifOrderFinished = this.isOrderFinished();
    }

    isOrderFinished = () => {
        let checkout = this.#checkoutTime;
        let now = new Date().toISOString();

        let checkoutMoment = moment(checkout);
        let nowMoment = moment(now);

        let expectedCheckout = moment(checkoutMoment).add(1, 'm');

        return nowMoment.isSame(expectedCheckout) || nowMoment.isAfter(expectedCheckout);
    }

    getRestaurant = () => this.#restaurant
    
    getCheckoutTime = () => {
        let endTime = moment(this.#checkoutTime).add(1, 'm');
        let startTime = moment(new Date().toISOString());
        return `${moment.utc(moment.duration(endTime) - moment.duration(startTime)).format('mm')} min`;
    }

    getFormattedDate = () => {
        return moment.utc(this.#checkoutTime).add(1, 'hours').format('LL');
    }; 
    
    getFormattedTime = () => {
        return moment.utc(this.#checkoutTime).add(1, 'hours').format('hh:mm A');
    }; 
    
    getOrders = () => {
        return this.#orders;
    };

    getCheckoutTimePercent = () =>{
        let nowTime = moment(new Date().toISOString());
        let orderTime = moment(this.#checkoutTime).add(1, 'hours').format('mm');
        return `${((orderTime / 100) * Number(nowTime.format('mm'))).toFixed(0)}`;
    };
}

let checkouts = JSON.parse(localStorage.getItem('orders')).map((item)=>{
    item.orders.forEach(item => {
        if (!(item.hasOwnProperty('id') && 
              item.hasOwnProperty('price') && 
              item.hasOwnProperty('title') &&
              item.hasOwnProperty('count'))) throw new Error(`Object doesn't have needed property in ${item}`);
    });

    item.orders.forEach(item => {
        if(!(item.id > 0 &&
             item.price > 0 && 
             5 < item.title.length < 30 &&
             item.count > 0)) throw new Error(`Object's ${item} contents doesn't match documentation`);
    });
    
    let countProps = 0;
    item.orders.forEach(item => {
        if(countProps > 4) throw new Error(`Object ${item} has more properties than needed`);
    });

    if(!(moment(item.checkout).isBefore(new Date().toISOString()))) throw new Error(`Object ${item} has has invalid time`);

    if(!(['Domino’s Pizza', 'McDonald’s', 'KFC'].includes(item.restaurant))){
        throw new Error(`Object ${item} has has invalid restaurant`);
    }

    return new Checkout(item.orders, item.checkout, item.restaurant);
});


//.checkout = moment(new Date().toISOString()).add(2, 'h');

let activeOrders = document.getElementsByClassName('coming-up')[0].getElementsByClassName('coming-up-item');
let previousOrders = document.getElementsByClassName('previous')[0].getElementsByClassName('previous-item');
for(let item of activeOrders) {
    item.setAttribute('id', `${item.querySelector('.h4').innerHTML}`);
}
for(let item of previousOrders) {
    item.setAttribute('id', `${item.querySelector('.h4').innerHTML}`);
}

let getLi = (orders, itemToAttach) => {
    for(let item of itemToAttach.childNodes){
        item.innerHTML = '';
    }

    for(let item of orders) {
        itemToAttach.insertAdjacentHTML('afterbegin', 
            `<li class="previous-item-dishes__item">
                <span class="previous-item-dishes__quantity">${item.count}</span>
                    ${item.title}
                </li>`
            );
    }
};

window.onload = (event) => {
    checkouts.forEach(item => {
        let inWorkList = document.getElementsByClassName('coming-up')[0].childNodes;
            inWorkList[1].style = 'display: none';
            inWorkList[3].style = 'display: none';
            inWorkList[5].style = 'display: none';

        if(!item.isOrderFinished()){
            if(!item.getOrders().length == 0){
                document.getElementById(`${item.getRestaurant()}`).querySelector('.coming-up-info__title').innerHTML = `${
                    item.getCheckoutTime()
                }`;
                document.getElementById(`${item.getRestaurant()}`).querySelector('.progress-bar__line').style = `width: ${
                    Number(item.getCheckoutTimePercent())
                }%`;
            }else document.getElementById(`${item.getRestaurant()}`).style = 'display: none';
        } else {
            if(!item.getOrders().length == 0){
                let prevList = document.getElementsByClassName('previous')[0].childNodes;   
    
                for(let i = 0; i < prevList.length; i++){
                    if(prevList[i].id === item.getRestaurant()){
                        prevList[i].querySelector('.previous-item-info__date').innerHTML = `${item.getFormattedDate()}`;
                        prevList[i].querySelector('.previous-item-info__time').innerHTML = `${item.getFormattedTime()}`;

                        getLi(item.getOrders(), prevList[i].querySelector('.previous-item-dishes'));
                    } else {
                        prevList[i].style = 'display: none';
                    }
                }
            }
        }
    });
};

//[0].getElementsByClassName('coming-up-item')[0].style = 'display: none')
