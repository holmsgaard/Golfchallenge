
golfchallengeApp.config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'app/partials/home.html',
                controller: 'HomeCtrl'
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
