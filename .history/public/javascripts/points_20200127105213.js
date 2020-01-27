// get the url params
const queryString = window.location.search;
// slice url params
const urlParams = new URLSearchParams(queryString);
// check if params exist
if(urlParams.has('tpsession_id')) {
    // get specific params
    // setTpSessionId(urlParams.get('tpsession_id'));
    setTpSessionId('60655f85-7927-4d3a-ba36-e5582a39280f');
    // current points - 2449797
}

function getTpSessionId() { return localStorage.getItem('tpSessionId'); }
function setTpSessionId(tpSessionId) { localStorage.setItem('tpSessionId', tpSessionId); }
// preparation for dynamic style of floating point wrapper
function getBGC() { return 'red'; }
function getColor() { return "#fff"; }

// append the initial html for points
const pointEl = '<div id="point-wrapper">'+
                    '<h5>--</h5>'+
                    '<p id="point-count">0</p>'+
                '</div>';
                // jQuery('body').append(pointEl);
// setup floating points sections
jQuery('div#point-wrapper').css({
    "position": "fixed",
    "right": 0,
    "bottom": "30%",
    "background": getBGC(),
    "border": "3px solid #fff",
    "color": getColor(),
    "padding": ".6em 2em",
    "-webkit-box-shadow": "-7px 7px 9px -8px rgba(0,0,0,0.73)",
    "-moz-box-shadow": "-7px 7px 9px -8px rgba(0,0,0,0.73)",
    "box-shadow": "-7px 7px 9px -8px rgba(0,0,0,0.73)"
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


jQuery.getJSON('/admin/api/2020-01/metafields.json', function(response) {
    alert('test');
    const metafieldsRes = response.metafields;
    const metafields =  metafieldsRes.filter(function(metafield) {
        return metafield.key == 'points';
    });
    const metafieldsObj = metafields[0];
    const metafieldVal = JSON.parse(metafieldsObj.value);
    console.log(metafieldVal);
    jQuery('div#point-wrapper h5').text(metafieldVal.pointWidgetTitle);
    if (metafieldVal.isRounded) {
        jQuery('div#point-wrapper').css({
            "border-radius": "30px 0 0 30px"
        });
    }
    setWidgetToken(metafieldVal.pointWidgetToken);
    setWidgetServer(metafieldVal.pointWidgetServer);

    // const tpSessionId = urlParams.get('tpsession_id');
    const srcId = 60; // for add 61 for deduct
    // do ajax request

    const postData = {
        "scrdata_id": 60,
        "tpsession_id":  '60655f85-7927-4d3a-ba36-e5582a39280f', // getTpSessionId(),
        "access_token": metafieldVal.pointWidgetToken
    }

    jQuery.post(
        'https://cors-anywhere.herokuapp.com/' + metafieldVal.pointWidgetServer,
        {"input": JSON.stringify(postData)},
        function( response ) {
            const resObj = JSON.parse(response.data);
            console.log(resObj);
            alert(resObj.total_tp_points);
            const totalPoints = (resObj != null) ? resObj.total_tp_points : 0;
            alert(totalPoints);
            jQuery('div#point-wrapper #point-count').text(totalPoints);

            if(totalPoints < 150 || totalPoints === 150) {
                jQuery('.selector-wrapper').hide();
            }
            if(totalPoints > 0 || totalPoints != 0) {
                jQuery('.cart__submit-controls input').addClass('hasPoints');
            }
        },
        'json'
    );
});

/**
 * @param {*} urlTarget string [should be valid url]
 * @param {*} postData json object
 * @param {*} callback
 */
function ajaxRequest(urlTarget, postData, callback) {

    jQuery.post(
        'https://cors-anywhere.herokuapp.com/' + urlTarget,
        {"input": JSON.stringify(postData)},
        function( response ) {
            // return callback
            alert('works');
            callback(response.data);
        }
    );
    // $.ajax({
    //     url: urlTarget,
    //     type: 'POST',
    //     dataType: 'json',
    //     data: {"input": JSON.stringify(postData)},
    //     beforeSend: function(x) {
    //         // show preload image
    //         $('div#point-wrapper #point-count').text('loading...');
    //     },
    //     success: function( response ) {
    //         // return callback
    //         callback(response.data);
    //     }
    // })
    // // using the fail promise callback
    // .fail(function(data) {
    //     // show any errors
    //     console.log(data);
    // });
}