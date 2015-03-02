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
      //for (var i = 0; i < matches.length; i++) {
      //    matches[i].courtName = app.data.courts[matches[i].court] ? app.data.courts[matches[i].court].name : 'Ukendt';
      //}
      $scope.matches = matches;

      $scope.syncCourses = function () {
          app.dataSync.courses();
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
            player.id = app.generateId();

            app.data.players.push(player);
            app.data.settings.firstVisit = false;
            app.updateLocalStorage();
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
      $scope.courses = app.data.courses;
      $scope.course = null;

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
          $scope.match = {};
          $scope.match.id = app.generateId();
          $scope.match.courseId = $scope.course;
          $scope.match.course = app.fetchData.course($scope.match.courseId);
          $scope.match.createDate = new Date();

          console.log($scope.match);

          var scorecards = [];
          for (var i = 0; i < $scope.selectedPlayers.length; i++) {
              var player = $scope.selectedPlayers[i];
              var scorecard = {
                  id: app.generateId(),
                  matchId: $scope.match.id,
                  playerId: player.id,
                  playerName: player.name,
                  playerHcp: player.hcp,
              };
              console.log(scorecard);
              var scores = [];
              console.log('coursedata', match.course);
              for (var s = 0; s < $scope.match.course.holes.length; s++) {
                  var hole = $scope.match.course.holes[s];
                  var score = {
                      id: app.generateId(),
                      scorecardId: scorecard.id,
                      holePar: hole.par,
                      holeNumber: hole.number,
                      score: null,
                      strokes: null
                  }
                  scores.push(score);
                  app.data.scores.push(score);
               }
              app.updateLocalStorageScores();
              scorecard.playerScores = scores;
              
              app.data.scorecards.push(scorecard);
              scorecards.push(scorecard);
          }
          app.updateLocalStorageScorecards();

          match.scorecards = scorecards;
          app.data.matches.push($scope.match);
          
          app.updateLocalStorage();

          window.location = '#/match/' + $scope.match.id;
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
      var matchId = $routeParams['matchId'];

      $scope.scorecardVisible = false;
      $scope.activeScorecard = null;



      $scope.match = app.fetchData.match(matchId);
      $scope.course = app.fetchData.course($scope.match.courseId);
      //$scope.matchIndex = matchIndex;
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

      var holeNumber = $routeParams['holeNumber'];
      var matchId = $routeParams['matchId'];

      $scope.holeNumber = holeNumber;
      $scope.nextHoleNumber = holeNumber < 17 ? Number(holeNumber) + 1 : null;
      $scope.isLastHole = $scope.nextHoleNumber == null ? true : false;

      $scope.scorecardVisible = false;
      $scope.activeScorecard = null;

      $scope.match = app.fetchData.match(matchId);
      $scope.scorecards = $scope.match.scorecards;

      console.log($scope.match.course.holes, 'holes');

      for (var i = 0; i < $scope.match.course.holes.length; i++) {
          var hole = $scope.match.course.holes[i];
          if (hole.number == holeNumber) {
              $scope.currentHole = hole;
          }
      }

      console.log($scope.match, 'match');
      console.log($scope.scorecards, 'scorecards');


      $scope.selectPlayer = function (id) {
          var getPlayerScorecard = function (playerId) {
              for (var i = 0; i < $scope.scorecards.length; i++) {
                  if ($scope.scorecards[i].playerId == playerId) {
                      return $scope.scorecards[i];
                  }
              }
          }
          console.log(id);
          $scope.scorecardVisible = true;
          
          
          $scope.activeScorecard = getPlayerScorecard(id);
          //$scope.activeScorecardHole = $scope.activeScorecard.playerScores[holeIndex];
          console.log($scope.activeScorecard, 'active scorevard');
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


//golfchallengeControllers.controller('CourseNewCtrl', ['$scope',
//    function ($scope) {
        

//        $scope.submit = function () {
//            var court = {}
//            court.name = $scope.name;

//            app.data.courts.push(court);
//            app.updateLocalStorageCourts();

//            window.location = '#/';
//        }
//    }]);

golfchallengeControllers.controller('PlayerNewCtrl', ['$scope',
    function ($scope) {
        
        $scope.createPlayer = function () {
            app.data.players.push({
                name: $scope.name,
                hcp: $scope.hcp,
                id: app.generateId()
            });

            app.updateLocalStoragePlayers();

            window.location = "#/";
        }

    }
]);

golfchallengeControllers.controller('FriendsCtrl', ['$scope',
    function ($scope) {
        console.log('friends loaded');
    }
]);