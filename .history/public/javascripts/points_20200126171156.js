/* Using a self-executing anonymous function - (function(){})(); - so that all variables and functions defined within 
aren’t available to the outside world. */

(function(){

    var loadScript = function(url, callback){

        var script = document.createElement("script");
        script.type = "text/javascript";

        // If the browser is Internet Explorer.
        if (script.readyState){ 
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
                }
            };
        // For any other browser.
        } else {
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    /* This is my app's JavaScript */
    var myAppJavaScript = function($){
        // $ in this scope references the jQuery object we'll use.
        // Don't use jQuery, or jQuery191, use the dollar sign.
        // Do this and do that, using $.

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
        $('body').append(pointEl);
        // setup floating points sections
        $('div#point-wrapper').css({
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

        $('div#point-wrapper h5').css({
            "padding": 0,
            "margin": 0,
            "text-transform": "uppercase",
            "text-align": "right"
        });

        $('div#point-wrapper #point-count').css({
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

        getMetafields(function(response) {
            const metafieldsRes = response.metafields;
            const metafields =  metafieldsRes.filter(function(metafield) {
                return metafield.key == 'points';
            });
            const metafieldsObj = metafields[0];
            const metafieldVal = JSON.parse(metafieldsObj.value);

            setWidgetToken(metafieldVal.pointWidgetToken);
            setWidgetServer(metafieldVal.pointWidgetServer);

            $('div#point-wrapper h5').text(metafieldVal.pointWidgetTitle);
            if (metafieldVal.isRounded) {
                $('div#point-wrapper').css({
                    "border-radius": "30px 0 0 30px"
                });
            }
            // const tpSessionId = urlParams.get('tpsession_id');
            const srcId = 60; // for add 61 for deduct
            // do ajax request
            addPoints(srcId, getTpSessionId(), getWidgetToken());
        });

        // add bind event on checkout button
        $(document).on('click', '.hasPoints', function() {
            if (confirm('This action will deduct ' + $('.product-details li:last-child() span').last().text() + ' points to your current points make sure you purchase the item.')) {
                const srcId = 61;
                const usedPoints = $('.product-details li:last-child() span').last().text();
                const selectedItems = [{
                    "item_name" : $('.list-view-item__title').find('a').text(),
                    "item_price" : $('.cart__price div > dl > div:visible > dd').text(),
                    "user_paid_amount" : $('.cart-subtotal__price').text(),
                    "quantity" : $('.cart__quantity-td .cart__qty').find('input').val(),
                    "item_category_name" : "",
                    "points_used" : usedPoints,
                    "item_page_link" : $('.list-view-item__title').find('a').attr('href')
                }]
                deductPoints(srcId, getTpSessionId(), getWidgetToken(), usedPoints, selectedItems);
            } else {
                return false;
            }
        });

        // business logic below
        /**
         * @param {*} srcId number
         * @param {*} tpSessionId string
         * @param {*} accessToken string
         */
        function addPoints(srcId, tpSessionId, accessToken) {
            // post data jsonObj
            const postData = {
                "scrdata_id": srcId,
                "tpsession_id": tpSessionId,
                "access_token": accessToken
            }

            ajaxRequest(endPoint(), postData, function(response) {
                const resObj = JSON.parse(response);
                const totalPoints = (resObj != null) ? resObj.total_tp_points : 0;
                $('div#point-wrapper #point-count').text(totalPoints);
                
                if(totalPoints < 150 || totalPoints === 150) {
                    $('.selector-wrapper').hide();
                }
                if(totalPoints > 0 || totalPoints != 0) {
                    $('.cart__submit-controls input').addClass('hasPoints');
                }

            });
        }
        /**
         * @param {*} srcId number
         * @param {*} tpSessionId string
         * @param {*} accessToken string
         * @param {*} usedPoints number
         * @param {*} selectedItems array of items
         */
        function deductPoints(srcId, tpSessionId, accessToken, usedPoints, selectedItems) {
            // post data jsonObj
            const postData = {
                "scrdata_id" : srcId,
                "tpsession_id" : tpSessionId,
                "access_token" : accessToken,
                "total_points_used" : usedPoints,
                "used_points_items" : selectedItems
            }

            ajaxRequest(endPoint(), postData, function(response) {
                const resObj = JSON.parse(response);
                const totalPoints = (resObj != null) ? resObj.total_tp_points : 0;
                $('div#point-wrapper #point-count').text(totalPoints);
            });
        }
        /**
         * @param {*} urlTarget string [should be valid url]
         * @param {*} postData json object
         * @param {*} callback
         */
        function ajaxRequest(urlTarget, postData, callback) {
            $.ajax({
                url: urlTarget,
                type: 'POST',
                dataType: 'json',
                data: {"input": JSON.stringify(postData)},
                beforeSend: function(x) {
                    // show preload image
                    $('div#point-wrapper #point-count').text('loading...');
                },
                success: function( response ) {
                    // return callback
                    callback(response.data);
                }
            })
            // using the fail promise callback
            .fail(function(data) {
                // show any errors
                console.log(data);
            });
        }

        function getMetafields(callback) {
            $.ajax({
                type: 'GET',
                url: '/admin/api/2020-01/metafields.json',
                dataType: 'json',
                success: function(response){
                    callback(response)
                 },
                error: function(data){
                    console.log(data);
                }
            })
        }
    };
    
    /* If jQuery has not yet been loaded or if it has but it's too old for our needs,
    we will load jQuery from the Google CDN, and when it's fully loaded, we will run
    our app's JavaScript. Set your own limits here, the sample's code below uses 1.7
    as the minimum version we are ready to use, and if the jQuery is older, we load 1.9. */
    if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
        loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function(){
            jQuery191 = jQuery.noConflict(true);
            myAppJavaScript(jQuery191);
        });
    } else {
        myAppJavaScript(jQuery);
    }

})();