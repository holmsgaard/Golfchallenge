//var client = new WindowsAzure.MobileServiceClient(
//    "https://jcdgc.azure-mobile.net/",
//    "fuCCmvlVagOVdGSZLiuuiWjNTtEdzs89"
//);

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();

        // Test
        //app.onDeviceReady();
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
        //if (typeof (localStorage['data']) == 'undefined') {
        //    app.data = {
        //        settings: {
        //            createDate: new Date(),
        //            firstVisit: true
        //        },
        //        matches: [],
        //        players: [],
        //        scorecards: []
        //    };
        //    localStorage['data'] = JSON.stringify(app.data);
        //}
        //else {
        //    app.data = JSON.parse(localStorage['data']);
        //}

        //window.location = "/#/home"

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
    },

    updateLocalStorage: function () {
        localStorage['data'] = JSON.stringify(app.data);
    },

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

app.initialize();

var golfchallengeApp = angular.module('golfchallengeApp', [
  'ngRoute',
  'golfchallengeControllers'
]);



