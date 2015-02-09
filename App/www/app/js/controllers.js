var golfchallengeControllers = angular.module('golfchallengeControllers', []);

console.log('controllers loaded');

golfchallengeControllers.controller('HomeCtrl', ['$scope', '$http',
  function ($scope, $http) {
      
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

      $scope.firstVisit = app.data.settings.firstVisit;

      if ($scope.firstVisit) {
          window.location = '#/home-first-visit';
          return;
      }

      console.log('home inited');

      $scope.matches = app.data.matches;

      //$http.get('http://api.golfchallenge.dk/Match/GetMatches').success(function (data) {
      //    var matches = [];
      //    for (var i = 0; i < data.length; i++) {
      //        var match = data[i],
      //            matchDate = app.dataFormat.formatDate(match.CreateDate).prettyDate;

      //        match.CreateDate = matchDate;
      //        matches.push(match);
      //    }
      //    $scope.matches = matches;
      //});
  }]);

golfchallengeControllers.controller('HomeFirstVisitCtrl', ['$scope',
    function ($scope) {
        console.log('first-visit inited');
        if (app.data.settings.firstVisit == false) {
            window.location = '/';
        }
        else {

        }
    }]);

golfchallengeControllers.controller('HomeFirstVisitCreatePlayerCtrl', ['$scope',
    function ($scope) {
        console.log('first-visit-create-player inited');
        if (app.data.settings.firstVisit == false) {
            window.location = '/';
        }

        $scope.submit = function () {
            var player = {}
            player.name = $scope.name;
            player.hcp = $scope.hcp;

            app.data.players.push(player);
            app.data.settings.firstVisit = false;
            app.updateLocalStorage();

            window.location = '#/';
        }
    }]);

golfchallengeControllers.controller('MatchDetailsCtrl', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
      console.log('match details inited');
  }]);

golfchallengeControllers.controller('MatchNewCtrl', ['$scope', '$http',
  function ($scope, $http) {
      var match = {
          createDate: new Date(),
          id: null,
          scorecards: []
      };

      $scope.players = app.data.players;

      





      // create new match
      //var newMatch = {};
      //client.getTable("matches").insert(newMatch).done(function (response) {
      //    $scope.newMatchId = response.id;
      //});

      //// init playerlist
      ////client.getTable("players").where({name: "Peter Holmsgaard"}).read().then(function (players) {
      //client.getTable("players").read().then(function (players) {
      //    $scope.players = players;
      //});

      $scope.selectPlayer = function (playerId) {
          console.log(this, event);
          console.log('Add player: ' + playerId, 'To match: ' + $scope.newMatchId);
          console.log('player', playerId);
          $scope.showNewPlayer = false;

      }

      $scope.toggleNewPlayerSelect = function () {
          var parent = event.target.parentElement,
              parentIsActive = true;
          
          if (parent.classList.contains('inactive')) {
              parent.classList.remove('inactive')
          }
          else {
              parent.classList.add('inactive');
          }
      }
  }]);