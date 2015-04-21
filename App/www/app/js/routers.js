
golfchallengeApp.config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'app/partials/home.html',
                controller: 'HomeCtrl'
            }).
            when('/court-new', {
                templateUrl: 'app/partials/court-new.html',
                controller: 'CourtNewCtrl'
            }).
            when('/home-first-visit', {
                templateUrl: 'app/partials/home-first-visit.html',
                controller: 'HomeFirstVisitCtrl'
            }).
            when('/home-first-visit-create-player', {
                templateUrl: 'app/partials/home-first-visit-create-player.html',
                controller: 'HomeFirstVisitCreatePlayerCtrl'
            }).
            when('/match-new', {
                templateUrl: 'app/partials/match-new.html',
                controller: 'MatchNewCtrl'
            }).
            when('/current-match', {
                templateUrl: 'app/partials/match.html',
                controller: 'CurrentMatchCtrl'
            }).
            when('/current-match/:holeIndex', {
                templateUrl: 'app/partials/hole.html',
                controller: 'CurrentMatchHoleCtrl'
            }).
            //when('/match', {
            //    templateUrl: 'app/partials/match.html',
            //    controller: 'MatchCtrl'
            //}).
            when('/match/:matchId', {
                templateUrl: 'app/partials/match.html',
                controller: 'MatchCtrl'
            }).
            when('/match/:matchId/:holeNumber', {
                templateUrl: 'app/partials/hole.html',
                controller: 'MatchHoleCtrl'
            }).
            when('/player-new', {
                templateUrl: 'app/partials/player-new.html',
                controller: 'PlayerNewCtrl'
            }).
            when('/friends', {
                    templateUrl: 'app/partials/friends.html',
                    controller: 'FriendsCtrl'
                }).
            otherwise({
                redirectTo: '/'
            });
        }]
    );
