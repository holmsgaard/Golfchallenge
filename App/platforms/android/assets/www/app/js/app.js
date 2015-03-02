var client = new WindowsAzure.MobileServiceClient(
    "https://jcdgc.azure-mobile.net/",
    "fuCCmvlVagOVdGSZLiuuiWjNTtEdzs89"
);

var app = {
    dataInit: function () {
        app.data = {};

        // Init data
        if (typeof (localStorage['data']) == 'undefined') {
            app.data = {
                settings: {
                    createDate: new Date(),
                    firstVisit: true
                },
                matches: [],
                players: [],
                scorecards: []
            };
            localStorage['data'] = JSON.stringify(app.data);
        }
        else {
            app.data = JSON.parse(localStorage['data']);
        }

        // Init courts
        if (typeof (localStorage['players']) == 'undefined') {
            app.data.players = [];
        }
        else {
            app.data.players = JSON.parse(localStorage['players']);
        }

        // Init courts
        if (typeof (localStorage['courts']) == 'undefined') {
            app.data.courts = [];
        }
        else {
            app.data.courts = JSON.parse(localStorage['courts']);
        }

        // Init courts
        if (typeof (localStorage['holes']) == 'undefined') {
            app.data.holes = [];
        }
        else {
            app.data.holes = JSON.parse(localStorage['holes']);
        }
    },
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
        console.log('updateLocalStorage()', JSON.stringify(app.data));
    },

    updateLocalStorageCourts: function () {
        localStorage['courts'] = JSON.stringify(app.data.courts);
        console.log('updateLocalStorageCourts()', app.data.courts);
    },

    updateLocalStorageHoles: function () {
        localStorage['holes'] = JSON.stringify(app.data.holes);
        console.log('updateLocalStorageHoles()', app.data.holes);
    },

    updateLocalStoragePlayers: function () {
        localStorage['players'] = JSON.stringify(app.data.players);
        console.log('updateLocalStoragePlayers()', app.data.players);
    },

    dataSync: {
        syncCourts: function () {
            console.log('sync');
            var courts = [];
            var holes = [];

            client.getTable("courts").read().then(function (courtsResponse) {
                for (var i = 0; i < courtsResponse.length; i++) {
                    var court = courtsResponse[i];
                    courts.push(court);
                }
                app.data.courts = courts;
                app.updateLocalStorageCourts();
            });

            client.getTable("holes").read().then(function (holeResponse) {
                for (var i = 0; i < holeResponse.length; i++) {
                    var hole = holeResponse[i];
                    holes.push(hole);
                }
                app.data.holes = holes;
                app.updateLocalStorageHoles();
            });
        }
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
app.dataInit();

var golfchallengeApp = angular.module('golfchallengeApp', [
  'ngRoute',
  'ngTouch',
  'golfchallengeControllers'
]);



