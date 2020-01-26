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

        // preparation for dynamic style of floating point wrapper
        function getBGC() {
            return 'red';
        }
        function getColor() {
            return "#fff";
        }

        const inputVal = {
            "scrdata_id" : 60,
            "tpsession_id" : "60655f85-7927-4d3a-ba36-e5582a39280f",
            "access_token" : "Aef5f85-79ef27qwwd-4d3a-ba36-e5582a3dw"
        }
        // append the initial html for points
        const pointEl = `<div id="point-wrapper"><form><input type="text" name="input" value="${JSON.stringify(inputVal)}"/></form><h5>Your Tasty Point</h5><p id="point-count">2000</p></div>`;
        $('body').append(pointEl);
        // check if params exist
        if(urlParams.has('tpsession_id')) {
            // set defaults
            let pointWidgetCount = 0;
            let pointWidgetTitle = 'Your Tasty Point';
            let isRounded = true;
            /// setup floating points sections
            if (isRounded) {
                $('div#point-wrapper').css({
                    "border-radius": "30px 0 0 30px"
                });
            }
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
            $('div#point-wrapper h5').text(pointWidgetTitle).css({
                "padding": 0,
                "margin": 0,
                "text-transform": "uppercase",
                "text-align": "right"
            });
            $('div#point-wrapper #point-count').text(pointWidgetCount).css({
                "font-size": "28px",
                "color": "#fff",
                "text-align": "right",
                "line-height": ".8"
            });
            // get specific params
            // const tpSessionId = urlParams.get('tpsession_id');
            const srcId = 60; // for add 61 for deduct
            const tpSessionId = '60655f85-7927-4d3a-ba36-e5582a39280f';
            const accessToken = 'Aef5f85-79ef27qwwd-4d3a-ba36-e5582a3dw';
            // do ajax request
            $('div#point-wrapper').find('form').submit(function(e) {
                e.preventDefault(); // avoid to execute the actual submit of the form.
                $.ajax({
                    type: "POST",
                    url: 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php',
                    data: $(this).serialize(), // serializes the form's elements.
                    success: function(data)
                    {
                        console.log(data); // show response from the php script.
                    }
                });
            });
            // addPoints(srcId, tpSessionId, accessToken);
        }

        // business logic below
        function getPoints() {

        }
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
            // end point url
            
            // const urlTarget = 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php';
            const urlTarget = 'https://cors-anywhere.herokuapp.com/https://98f35fa5.ngrok.io/points';

            ajaxRequest(urlTarget, postData, function(response) {
                console.log(response);
                // $('div#point-wrapper #point-count').text(response.total_tp_points);
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
                "used_points_items" : [selectedItems]
            }
            // end point url
            const urlTarget = 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php';

            ajaxRequest(urlTarget, postData, function(response) {
                console.log(response);
                // $('div#point-wrapper #point-count').text(response.total_tp_points);
            });
        }
    
        function ajaxRequest(urlTarget, postData, callback) {
            $.ajax({
                url: urlTarget,
                type: 'POST',
                dataType: 'json',
                // contentType: 'application/json',
                data: postData,
                beforeSend: function(x) {
                    // show preload image
                },
                success: function( response ) {
                    callback(response.data);
                }
            })
            // using the fail promise callback
            .fail(function(data) {
                // show any errors
                // best to remove for production
                console.log(data);
            });
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