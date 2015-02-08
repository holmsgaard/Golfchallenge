var golfchallengeControllers = angular.module('golfchallengeControllers', []);

console.log('controllers loaded');

golfchallengeControllers.controller('HomeCtrl', ['$scope', '$http',
  function ($scope, $http) {
      console.log('home inited');

      $http.get('http://api.golfchallenge.dk/Match/GetMatches').success(function (data) {
          var matches = [];
          for (var i = 0; i < data.length; i++) {
              var match = data[i],
                  matchDate = app.dataFormat.formatDate(match.CreateDate).prettyDate;

              match.CreateDate = matchDate;
              matches.push(match);
          }
          $scope.matches = matches;
      });
  }]);

golfchallengeControllers.controller('MatchDetailsCtrl', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
      console.log('match details inited');
  }]);

golfchallengeControllers.controller('MatchNewCtrl', ['$scope', '$http',
  function ($scope, $http) {
      // create new match
      var newMatch = {};
      client.getTable("matches").insert(newMatch).done(function (response) {
          $scope.newMatchId = response.id;
      });

      // init playerlist
      //client.getTable("players").where({name: "Peter Holmsgaard"}).read().then(function (players) {
      client.getTable("players").read().then(function (players) {
          $scope.players = players;
      });

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