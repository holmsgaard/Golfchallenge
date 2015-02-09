
golfchallengeApp.config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'app/partials/home.html',
                controller: 'HomeCtrl'
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
            when('/match', {
                templateUrl: 'app/partials/match.html',
                controller: 'MatchCtrl'
            }).
            when('/match/:matchId', {
                templateUrl: 'app/partials/match.html',

                controller: 'MatchDetailsCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        }]
    );
