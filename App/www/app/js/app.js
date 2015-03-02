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
                scorecards: [],
                holes: [],
                scores: []
            };
            localStorage['data'] = JSON.stringify(app.data);
        }
        else {
            app.data = JSON.parse(localStorage['data']);
        }

        var initLocalStorage = function (name) {
            if (typeof (localStorage[name]) == 'undefined') {
                app.data[name] = [];
            }
            else {
                app.data[name] = JSON.parse(localStorage[name]);
            }
        }

        // Init players
        initLocalStorage('players');
        //if (typeof (localStorage['players']) == 'undefined') {
        //    app.data.players = [];
        //}
        //else {
        //    app.data.players = JSON.parse(localStorage['players']);
        //}

        // Init courts
        if (typeof (localStorage['courses']) == 'undefined') {
            app.data.courses = [];
        }
        else {
            app.data.courses = JSON.parse(localStorage['courses']);
        }

        // Init holes
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
        //console.log('updateLocalStorage()', JSON.stringify(app.data));
    },

    updateLocalStorageCourses: function () {
        localStorage['courses'] = JSON.stringify(app.data.courses);
        //console.log('updateLocalStorageCourts()', app.data.courts);
    },

    updateLocalStorageScorecards: function () {
        localStorage['scorecards'] = JSON.stringify(app.data.scorecards);
        //console.log('updateLocalStorageScorecards()', app.data.scorecards);
    },

    updateLocalStorageScores: function () {
        localStorage['scores'] = JSON.stringify(app.data.scores);
        //console.log('updateLocalStorageScorecards()', app.data.scorecards);
    },

    updateLocalStorageHoles: function () {
        localStorage['holes'] = JSON.stringify(app.data.holes);
        //console.log('updateLocalStorageHoles()', app.data.holes);
    },

    updateLocalStoragePlayers: function () {
        localStorage['players'] = JSON.stringify(app.data.players);
        //console.log('updateLocalStoragePlayers()', app.data.players);
    },

    dataSync: {
        courses: function () {
            console.log('sync');
            var courses = [];
            var holes = [];

            client.getTable("courts").read().then(function (coursesResponse) {
                console.log(coursesResponse);
                for (var i = 0; i < coursesResponse.length; i++) {
                    var course = coursesResponse[i];
                    courses.push(course);
                }
                app.data.courses = courses;
                app.updateLocalStorageCourses();
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
    },

    generateId: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    },

    fetchData: {
        course: function (id) {
            for (var i = 0; i < app.data.courses.length; i++) {
                if (app.data.courses[i].id == id) {
                    app.data.courses[i].holes = [];
                    for (var hi = 0; hi < app.data.holes.length; hi++) {
                        if (app.data.holes[hi].courtid == id) {
                            app.data.courses[i].holes.push(app.data.holes[hi]);
                        }
                    }

                    return app.data.courses[i];
                }
            }
            return null;
        },

        //hole: function(id) {
        //    for (var i = 0; i < app.data.holes.length; i++) {
        //        if (app.data.holes[i].id == id) {

        //            for (var hi = 0; hi < app.data.holes.length; hi++) {
        //                if (app.data.holes[hi].courtid == id) {
        //                    app.data.courses[i].holes.push(app.data.holes[hi]);
        //                }
        //            }

        //            return app.data.courses[i];
        //        }
        //    }
        //    return null;
        //},

        matches: function () {

        },

        match: function (id) {
            for (var i = 0; i < app.data.matches.length; i++) {
                var match = app.data.matches[i];
                if (match.id == id) {
                    match.scorecards = [];
                    for (var si = 0; si < app.data.scorecards.length; si++) {
                        if (app.data.scorecards[si].matchId == id) {
                            match.scorecards.push(app.data.scorecards[si]);
                        }
                    }
                    match.course = app.fetchData.course(match.courseId);
                    
                    return app.data.matches[i];
                }
            }
            return null;
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



