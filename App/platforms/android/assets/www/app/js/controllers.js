var golfchallengeControllers = angular.module('golfchallengeControllers', []);

console.log('controllers loaded');

golfchallengeControllers.controller('HomeCtrl', ['$scope', '$http',
  function ($scope, $http) {
      $scope.overlapMenuVisible = false;
      $scope.menuVisible = false;
      

      $scope.firstVisit = app.data.settings.firstVisit;

      if ($scope.firstVisit) {
          window.location = '#/home-first-visit';
          return;
      }

      $scope.goToMatch = function (id) {
          window.location = '#/match/' + id;
      }
      $scope.nav = function (url) {
          window.location = url;
      }

      // Slå banenavnet op
      var matches = app.data.matches;
      for (var i = 0; i < matches.length; i++) {
          matches[i].courtName = app.data.courts[matches[i].court] ? app.data.courts[matches[i].court].name : 'Ukendt';
      }
      $scope.matches = matches;

      $scope.syncCourts = function () {
          app.dataSync.syncCourts();
      }

  }]).filter('cmdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
  ]);

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
            app.updateLocalStoragePlayers();

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

      $scope.date = match.createDate;
      $scope.courts = app.data.courts;
      $scope.court = null;

      $scope.players = app.data.players;
      $scope.selectedPlayers = [];

      if ($scope.players.length > 0) {
          $scope.players[0].selected = true;
          $scope.selectedPlayers.push($scope.players[0]);
      }

      $scope.$watch(function () {
          $scope.selectedPlayers = [];
          angular.forEach($scope.players, function (obj, k) {
              if (obj.selected) {
                  $scope.selectedPlayers.push(obj);
              }
          });
      });

      $scope.createMatch = function () {
          var scorecards = [];
          for (var i = 0; i < $scope.selectedPlayers.length; i++) {
              var player = $scope.selectedPlayers[i];
              var scores = [];
              for (var s = 0; s < 18; s++) {
                  scores.push({
                      index: s,
                      score: null,
                      strokes: null
                  });
              }
              var scorecard = {
                  playerId: player.id,
                  playerName: player.name,
                  playerHcp: player.hcp,
                  playerScores: scores
              };
              scorecards.push(scorecard);
          }
          match.scorecards = scorecards;
          match.court = $scope.court;

          app.data.matches.push(match);
          app.updateLocalStorage();

          window.location = '#/';
          console.log(match);
      }


      





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

golfchallengeControllers.controller('MatchCtrl', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
      var matchIndex = $routeParams['matchId'];

      $scope.scorecardVisible = false;
      $scope.activeScorecard = null;

      $scope.match = app.data.matches[matchIndex];
      $scope.matchIndex = matchIndex;
      $scope.scorecards = $scope.match.scorecards;

      //$scope.setPlayerScore = function (score) {
      //    $scope.activeScorecard.score = score;
      //}

      //$scope.setPlayerStrokes = function (strokes) {
      //    $scope.activeScorecard.strokes = strokes;
      //}

      $scope.saveScorecard = function () {
          $scope.scorecardVisible = false;
          app.updateLocalStorage();

          // Der er et hul, hvis dialogen bliver lukket istedet for "gem og luk",
          // så vil scoren ligge i app.data men ikke i localstorage, før der bliver
          // synkroniseret næste gang.
      }

      $scope.selectPlayer = function (index) {
          $scope.scorecardVisible = true;
          $scope.activeScorecard = $scope.scorecards[index];
          console.log($scope.activeScorecard);

      }

      console.log($scope.match);
      console.log('match inited');
      //var match = {
      //    createDate: new Date(),
      //    id: null,
      //    scorecards: []
      //};

      //$scope.date = match.createDate;
      //$scope.players = app.data.players;
      //$scope.selectedPlayers = [];

      //if ($scope.players.length > 0) {
      //    $scope.players[0].selected = true;
      //    $scope.selectedPlayers.push($scope.players[0]);
      //}

      //$scope.$watch(function () {
      //    $scope.selectedPlayers = [];
      //    angular.forEach($scope.players, function (obj, k) {
      //        if (obj.selected) {
      //            $scope.selectedPlayers.push(obj);
      //        }
      //    });
      //});

      








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



      //$scope.selectPlayer = function (playerId) {
      //    console.log(this, event);
      //    console.log('Add player: ' + playerId, 'To match: ' + $scope.newMatchId);
      //    console.log('player', playerId);
      //    $scope.showNewPlayer = false;

      //}

  }]).filter('cmdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
  ]);

golfchallengeControllers.controller('MatchHoleCtrl', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
      // opdaterer players - skal evt. gøres efter hver indtastning
      app.updateLocalStoragePlayers();
      app.updateLocalStorage();

      // Swiper!
      

      var holeIndex = $routeParams['holeIndex'];
      var matchIndex = $routeParams['matchId'];

      $scope.holeIndex = holeIndex;
      $scope.currentHoleNumber = Number(holeIndex) + 1;
      $scope.nextHoleNumber = holeIndex < 17 ? Number(holeIndex) + 1 : null;
      $scope.isLastHole = $scope.nextHoleNumber == null ? true : false;

      $scope.scorecardVisible = false;
      $scope.activeScorecard = null;

      $scope.match = app.data.matches[matchIndex];
      $scope.matchIndex = matchIndex;
      $scope.scorecards = $scope.match.scorecards;

      console.log($scope.scorecards);


      $scope.selectPlayer = function (index) {
          $scope.scorecardVisible = true;
          $scope.activeScorecard = $scope.scorecards[index];
          $scope.activeScorecardHole = $scope.activeScorecard.playerScores[holeIndex];
          console.log($scope.activeScorecard, $scope.activeScorecardHole);
      }

      $scope.swipeTest = function () {
          window.location = '#/match/' + matchIndex + '/' + $scope.nextHoleNumber;
      }











  }]).filter('cmdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
  ]);


golfchallengeControllers.controller('CourtNewCtrl', ['$scope',
    function ($scope) {
        

        $scope.submit = function () {
            var court = {}
            court.name = $scope.name;

            app.data.courts.push(court);
            app.updateLocalStorageCourts();

            window.location = '#/';
        }
    }]);

golfchallengeControllers.controller('PlayerNewCtrl', ['$scope',
    function ($scope) {
        
        $scope.createPlayer = function () {
            app.data.players.push({
                name: $scope.name,
                hcp: $scope.hcp
            });

            app.updateLocalStoragePlayers();

            window.location = "#/";
        }

    }]);