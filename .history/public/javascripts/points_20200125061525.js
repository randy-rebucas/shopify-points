/* Sample JavaScript file added with ScriptTag resource. 
This sample file is meant to teach best practices.
Your app will load jQuery if it's not defined. 
Your app will load jQuery if jQuery is defined but is too old, e.g. < 1.7. 
Your app does not change the definition of $ or jQuery outside the app. 
Example: if a Shopify theme uses jQuery 1.4.2, both of these statements run in the console will still return '1.4.2'
once the app is installed, even if the app uses jQuery 1.9.1:
jQuery.fn.jquery => "1.4.2" 
$.fn.jquery -> "1.4.2"
*/

/* Using a self-executing anonymous function - (function(){})(); - so that all variables and functions defined within 
aren’t available to the outside world. */

(function(){

    /* Load Script function we may need to load jQuery from the Google's CDN */
    /* That code is world-reknown. */
    /* One source: http://snipplr.com/view/18756/loadscript/ */

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
            const tpSessionId = urlParams.get('tpsession_id');
            const accessToken = '6d99cce17b9bcc2533da22b7be7f1aae';

            $('body').append(`<p>Tp Session Id: ${tpSessionId} </p>`);
            // // do ajax request
            const postData = { 
                "scrdata_id" : 60, 
                "tpsession_id" : "60655f85-7927-4d3a-ba36-e5582a39280f", 
                "access_token" : "Aef5f85-79ef27qwwd-4d3a-ba36-e5582a3dw" 
            } 
            $.ajax({
                type: 'POST',
                // contentType: 'application/json',
                url: 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php',
                data: postData,
                dataType: 'json',
                beforeSend: function( xhr ) {
                    console.log('before send ' + xhr);
                    // xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                },
                success: function( res ) {
                    console.log('before send ' + res);
                    // xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                }
            });

            // var r = new XMLHttpRequest();
            // r.onreadystatechange = function(){
            //     // do something
            //     r.open("POST", 'https://tastypoints.io/akm/restapi.php', true);
            //     r.send();
            // }
            // var xhr = new XMLHttpRequest();
            // xhr.open("POST", 'https://cors-anywhere.herokuapp.com/https://tastypoints.io/akm/restapi.php', postData);

            // //Send the proper header information along with the request
            // xhr.setRequestHeader("Content-Type", "application/json");
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            // xhr.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

            // xhr.onreadystatechange = function() { // Call a function when the state changes.
            //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            //         // Request finished. Do processing here.
            //         console.log(XMLHttpRequest);
            //     }
            // }
            // xhr.send();
        }
        // $('body').append('<p>Your app is using jQuery version '+$.fn.jquery+'</p>');
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