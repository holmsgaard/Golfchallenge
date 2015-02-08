// Azure connection
var client = new WindowsAzure.MobileServiceClient(
    "https://jcdgc.azure-mobile.net/",
    "fuCCmvlVagOVdGSZLiuuiWjNTtEdzs89"
);

var golfchallengeApp = angular.module('golfchallengeApp', [
  'ngRoute',
  'golfchallengeControllers'
]);

golfchallengeApp.config(['$routeProvider',
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
  }]);

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