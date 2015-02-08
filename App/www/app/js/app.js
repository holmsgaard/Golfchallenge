var client = new WindowsAzure.MobileServiceClient(
    "https://jcdgc.azure-mobile.net/",
    "fuCCmvlVagOVdGSZLiuuiWjNTtEdzs89"
);

var golfchallengeApp = angular.module('golfchallengeApp', [
  'ngRoute',
  'golfchallengeControllers'
]);




var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        // Inject online data ?

        console.log(window.location);
        // Azure connection
  
        // Init data obj if first login??




    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var app = {
    dataFormat: {
        formatDate: function (unixdate) {
            console.log(unixdate);
            if (unixdate) {
                var date = new Date(parseInt(unixdate.replace("/Date(", "").replace(")/", ""), 10));
                console.log(date);

                return {
                    date: date,
                    prettyDate: date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
                };
            }
            else {
                return "Udefineret!";
            }
        }
    }
};

