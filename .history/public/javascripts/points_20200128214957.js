// get the url params
const queryString = window.location.search;
// slice url params
const urlParams = new URLSearchParams(queryString);
// check if params exist
if(urlParams.has('tpsession_id')) {
    // get specific params
    setTpSessionId(urlParams.get('tpsession_id'));
}

function getTpSessionId() { 
    return localStorage.getItem('tpSessionId') ? localStorage.getItem('tpSessionId') : '60655f85-7927-4d3a-ba36-e5582a39280f'; 
}

function setTpSessionId(tpSessionId) { localStorage.setItem('tpSessionId', tpSessionId); }

// append the initial html for points
const pointEl = '<div id="point-wrapper">'+
                    '<h5>--</h5>'+
                    '<p id="point-count">0</p>'+
                '</div>';
jQuery('body').append(pointEl);
// setup floating points sections
jQuery('div#point-wrapper').css({
    "position": "fixed",
    "right": 0,
    "bottom": "30%",
    "background": 'red',
    "border": "3px solid #fff",
    "color": "#fff",
    "padding": ".6em 2em",
    "border-radius": "30px 0 0 30px",
    "-webkit-box-shadow": "-7px 7px 9px -8px rgba(0,0,0,0.73)",
    "-moz-box-shadow": "-7px 7px 9px -8px rgba(0,0,0,0.73)",
    "box-shadow": "-7px 7px 9px -8px rgba(0,0,0,0.73)",
    "z-index": 999
});

jQuery('div#point-wrapper h5').css({
    "padding": 0,
    "margin": 0,
    "text-transform": "uppercase",
    "text-align": "right"
});

jQuery('div#point-wrapper #point-count').css({
    "font-size": "28px",
    "color": "#fff",
    "text-align": "right",
    "line-height": ".8"
});

widgetToken = '';
widgetServer = '';

function getWidgetToken() { return this.widgetToken; }
function setWidgetToken(token) { widgetToken = token; }

function getWidgetServer() { return this.widgetServer; }
function setWidgetServer(server) { widgetServer = server; }
// end point url
function endPoint() {
    return 'https://cors-anywhere.herokuapp.com/' + getWidgetServer();
}

// add bind event on checkout button
$(document).on('click', '.hasPoints', function() {
    if (confirm('This action will deduct ' + $('.product-details li:last-child() span').last().text() + ' points to your current points make sure you purchase the item.')) {
        const usedPoints = $('.product-details li:last-child()').first().match(/(\d+)/);
        const selectedItems = [{
            "item_name" : $('.list-view-item__title').find('a').text().replace(/\s/g, ''),
            "item_price" : $('.cart__price div > dl > div:visible > dd').text().replace(/\s/g, ''),
            "user_paid_amount" : $('.cart-subtotal__price').text(),
            "quantity" : $('.cart__quantity-td .cart__qty').find('input').val(),
            "item_category_name" : "",
            "points_used" : usedPoints,
            "item_page_link" : $('.list-view-item__title').find('a').attr('href')
        }]
        console.log(usedPoints);
        console.log(selectedItems);
        // deductPoints(usedPoints, selectedItems);
        return false;
    } else {
        return false;
    }
});

addPoints();
// var xhttpPoints = new XMLHttpRequest();
// var xhttpStore = new XMLHttpRequest();
// xhttpStore.onreadystatechange = function() {
    // if (this.readyState == 4 && this.status == 200) {
        // const metafieldsRes = JSON.parse(this.response).metafields;
        // const metafields =  metafieldsRes.filter(function(metafield) {
        //     return metafield.key == 'points';
        // });
        // const metafieldsObj = metafields[0];
        // const metafieldVal = JSON.parse(metafieldsObj.value);
        // console.log(metafieldVal);
        // const title = metafieldVal.pointWidgetTitle;
        // const server = metafieldVal.pointWidgetServer;
        // const token = metafieldVal.pointWidgetToken;
        // submit points
        // const postData = {
        //     "scrdata_id": 60,
        //     "tpsession_id":  getTpSessionId(),
        //     "access_token": 'Aef5f85-79ef27qwwd-4d3a-ba36-e5582a3dw'
        // }
        // xhttpPoints.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         const responseObj = JSON.parse(this.response).data;
        //         const pointObj = JSON.parse(responseObj);
        //         const totalPoints = (pointObj != null) ? pointObj.total_tp_points : 0;

        //         var pointWrapper = document.getElementById('point-wrapper');
        //         pointWrapper.getElementsByTagName('h5')[0].innerHTML = 'The Tasty Points'; // title;
        //         pointWrapper.getElementsByTagName('p')[0].innerHTML = totalPoints;
        //     }
        // };
        // xhttpPoints.open("POST", 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php', false);
        // xhttpPoints.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // xhttpPoints.send(JSON.stringify({"input": postData}));
    // }
// };
// xhttpStore.open("GET", '/admin/api/2020-01/metafields.json', true);
// xhttpStore.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
// xhttpStore.send();
function addPoints() {
    var xhttpPoints = new XMLHttpRequest();
    const postData = {
        "scrdata_id": 60,
        "tpsession_id":  getTpSessionId(),
        "access_token": 'Aef5f85-79ef27qwwd-4d3a-ba36-e5582a3dw'
    }
    xhttpPoints.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const responseObj = JSON.parse(this.response).data;
            const pointObj = JSON.parse(responseObj);
            const totalPoints = (pointObj != null) ? pointObj.total_tp_points : 0;

            var pointWrapper = document.getElementById('point-wrapper');
            pointWrapper.getElementsByTagName('h5')[0].innerHTML = 'The Tasty Points'; // title;
            pointWrapper.getElementsByTagName('p')[0].innerHTML = totalPoints;

            if(totalPoints < 150 || totalPoints === 150) {
                $('.selector-wrapper').hide();
            }
            if(totalPoints > 0 || totalPoints != 0) {
                $('.cart__submit-controls input').addClass('hasPoints');
            }
        }
    };
    xhttpPoints.open("POST", 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php', false);
    xhttpPoints.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpPoints.send(JSON.stringify({"input": postData}));
}

function deductPoints(usedPoints, selectedItems) {
    var xhttpPoints = new XMLHttpRequest();
    const postData = {
        "scrdata_id" : 61,
        "tpsession_id" : getTpSessionId(),
        "access_token" : 'Aef5f85-79ef27qwwd-4d3a-ba36-e5582a3dw',
        "total_points_used" : usedPoints,
        "used_points_items" : selectedItems
    }
    xhttpPoints.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            const responseObj = JSON.parse(this.response).data;
            const pointObj = JSON.parse(responseObj);
            const totalPoints = (pointObj != null) ? pointObj.total_tp_points : 0;

            var pointWrapper = document.getElementById('point-wrapper');
            pointWrapper.getElementsByTagName('p')[0].innerHTML = totalPoints;
        }
    };
    xhttpPoints.open("POST", 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php', false);
    xhttpPoints.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttpPoints.send(JSON.stringify({"input": postData}));
}