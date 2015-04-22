var golfchallengeControllers = angular.module('golfchallengeControllers', []);

// Init current match
golfchallengeControllers.run(function ($rootScope) {
    if (typeof (localStorage['currentMatch']) != 'undefined') {
        $rootScope.currentMatch = JSON.parse(localStorage['currentMatch']);
    }
    else {
        $rootScope.currentMatch = null;
    }

    $rootScope.clearCurrentMatchStorage = function () {
        localStorage['currentMatch'] = null;
        $rootScope.currentMatch = null;
    };

    $rootScope.updateCurrentMatchStorage = function () {
        localStorage['currentMatch'] = JSON.stringify($rootScope.currentMatch);
        console.log('Storage updated currentmatch');
    };

    // fjernes herfra og ind i sin egen controller
    $rootScope.publishCurrentMatch = function () {
        var match = $rootScope.currentMatch;
        if (match) {
            var sqlMatch = {
                courseid: match.course.id,
                date: match.createDate
            };

            console.log(match);

            

            client.getTable("matches").insert(sqlMatch).done(function (response) {
                var scorecardTable = client.getTable("scorecards");

                for (var i = 0; i < match.scorecards.length; i++) {
                    var scorecard = match.scorecards[i];
                    console.log(scorecard);
                    var sqlScorecard = {
                        matchid: response.id,
                        courseid: response.courseid,
                        playerid: scorecard.playerId
                    }
                    // Create scorecards
                    scorecardTable.insert(sqlScorecard).done(function (scorecardResponse) {
                        var scoresTable = client.getTable("scores");

                        console.log(scorecard);

                        for (var si = 0; si < scorecard.playerScores.length; si++) {
                            var playerScore = scorecard.playerScores[si];
                            var sqlPlayerScore = {
                                matchid: response.id,
                                scorecardid: scorecardResponse.id,
                                strokes: playerScore.strokes,
                                score: playerScore.score,
                                playerid: scorecard.playerId
                            }

                            console.log(sqlPlayerScore);

                            scoresTable.insert(sqlPlayerScore).done(function (scoresResponse) {
                                console.log(scoresResponse);
                            });
                        }
                        console.log(scorecardResponse);
                    });
                }
            });
        }
    };
});

// Home view controller
golfchallengeControllers.controller('HomeCtrl', ['$scope', '$http', '$rootScope', 'serviceMatches',
  function ($scope, $http, $rootScope, serviceMatches) {

      


      $scope.overlapMenuVisible = false;
      $scope.menuVisible = false;

      $scope.activeMatchVisible = $rootScope.currentMatch ? true : false;
      

      console.log('current match', $rootScope.currentMatch);

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

      $scope.deleteMatch = function () {
          console.log('wat');
          $rootScope.clearCurrentMatchStorage();
          window.location = "/";
      }

      // Slå banenavnet op
      var matches = app.data.matches;
      //for (var i = 0; i < matches.length; i++) {
      //    matches[i].courtName = app.data.courts[matches[i].court] ? app.data.courts[matches[i].court].name : 'Ukendt';
      //}
      $scope.matches = matches;

      $scope.syncCourses = function () {
          app.dataSync.courses();
          app.dataSync.players();
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

//golfchallengeControllers.controller('MatchDetailsCtrl', ['$scope', '$routeParams',
//  function ($scope, $routeParams) {
//      console.log('match details inited');
//  }]);
golfchallengeControllers.controller('MatchesCtrl', ['$scope', 'serviceMatches',
  function ($scope, serviceMatches) {
      serviceMatches.fetch().then(function (response) {
          $scope.$apply(function () {
              $scope.matches = response;

              
              console.log($scope.matches);
          });
          
          angular.forEach($scope.matches, function (obj, i) {
                  obj.wat = "1";
                  serviceMatches.getCourseById(obj.courseid).then(function (courseResponse) {
                      $scope.$apply(function () {
                          obj.course = courseResponse[0];
                      });
                  
                  });
              
          })

      });
  }]).filter('cmdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
  ]);



golfchallengeControllers.controller('MatchNewCtrl', ['$scope', '$http', '$rootScope',
  function ($scope, $http, $rootScope) {
      var match = {
          createDate: new Date(),
          scorecards: []
      };

      $scope.date = match.createDate;
      $scope.courses = app.data.courses;
      $scope.selectedCourse = null;

      $scope.players = app.data.players;
      $scope.selectedPlayers = [];

      if ($scope.players.length > 0) {
          $scope.players[0].selected = true;
          $scope.selectedPlayers.push($scope.players[0]);
      }

      $scope.selectCourse = function ($index) {
          angular.forEach($scope.courses, function (obj) {
              obj.selected = false;
          });
          $scope.selectedCourse = $scope.courses[$index];
          $scope.selectedCourse.selected = true;
      }

      $scope.togglePlayer = function ($index) {
          
          if ($scope.players[$index].selected == true) {
              $scope.players[$index].selected = false;
          }
          else {
              $scope.players[$index].selected = true;
          }
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
          //$scope.match.id = app.generateId();
          $scope.match.course = app.fetchData.course($scope.selectedCourse.id);
          $scope.match.createDate = new Date();



          var scorecards = [];
          console.log($scope.match, '1');
          for (var i = 0; i < $scope.selectedPlayers.length; i++) {
              var player = $scope.selectedPlayers[i];
              var scorecard = {
                  //id: app.generateId(),
                  //matchId: $scope.match.id,
                  playerId: player.id,
                  playerName: player.name,
                  playerHcp: player.hcp
              };
              var scores = [];
              for (var s = 0; s < $scope.match.course.holes.length; s++) {
                  var hole = $scope.match.course.holes[s];
                  var score = {
                      //id: app.generateId(),
                      //scorecardId: scorecard.id,
                      //holeId: hole.id,
                      holePar: hole.par,
                      holeNumber: hole.number,
                      score: null,
                      strokes: null
                  }
                  scores.push(score);
               }
              scorecard.playerScores = scores;
              scorecards.push(scorecard);
          }

          console.log($scope.match);

          $scope.match.scorecards = scorecards;
          $rootScope.currentMatch = $scope.match;

          localStorage['currentMatch'] = JSON.stringify($scope.match);

          window.location = '#/current-match';
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

golfchallengeControllers.controller('CurrentMatchCtrl', ['$scope', '$routeParams', '$rootScope',
  function ($scope, $routeParams, $rootScope) {
      $scope.match = $rootScope.currentMatch;

      $scope.scorecardVisible = false;
      $scope.activeScorecard = null;

      $scope.course = $scope.match.course ? $scope.match.course : {};
      $scope.firstHoleId = 0;
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
      }

      $scope.selectPlayer = function (index) {
          $scope.scorecardVisible = true;
          $scope.activeScorecard = $scope.scorecards[index];
          console.log($scope.activeScorecard);
      }
      

  }]).filter('cmdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
  ]);

golfchallengeControllers.controller('CurrentMatchHoleCtrl', ['$scope', '$routeParams', '$rootScope',
  function ($scope, $routeParams, $rootScope) {
      // opdaterer players - skal evt. gøres efter hver indtastning
      //app.updateLocalStoragePlayers();
      //app.updateLocalStorageScores();
      //app.updateLocalStorageScorecards();
      //app.updateLocalStorage();


      // Swiper!


      var holeIndex = $routeParams['holeIndex'];
      var holeNumber = Number(holeIndex) + 1;
      var matchId = $routeParams['matchId'];

      $scope.match = $rootScope.currentMatch;
      $scope.scorecards = $scope.match.scorecards;

      console.log('scorecards scpåe', $scope.match.scorecards);
      //$scope.holeScores = $scope.scorecards(hole);

      //console.log('scorecards', $scope.scorecards);

      $scope.holeNumber = holeNumber;
      $scope.holeIndex = holeIndex;
      $scope.nextHoleIndex = holeIndex < $scope.match.course.holes.length - 1 ? Number(holeIndex) + 1 : null;
      $scope.prevHoleIndex = holeIndex != 0 ? holeIndex - 1 : holeIndex;
      $scope.isLastHole = $scope.nextHoleIndex == null ? true : false;

      $scope.scorecardVisible = false;
      $scope.activeScorecard = null;

      //$scope.scorecards = $scope.match.scorecards;
      //$scope.playerScores = [];
      //for (var i = 0; i < $scope.scorecards.length; i++) {
      //    for (var pi = 0; pi < $scope.scorecards[i].playerScores.length;pi++) {
      //        if ($scope.scorecards[i].playerScores[pi].holeNumber == $scope.holeNumber) {
      //            $scope.scorecards[i].playerScores[pi].playerName = $scope.scorecards[i].playerName;
      //            $scope.playerScores.push($scope.scorecards[i].playerScores[pi]);
      //        }
      //    }

      //}
      //console.log($scope.playerScores, 'playerscores')

      //console.log($scope.match.course.holes, 'holes');

      for (var i = 0; i < $scope.match.course.holes.length; i++) {
          var hole = $scope.match.course.holes[i];
          if (hole.number == holeNumber) {
              $scope.currentHole = hole;
          }
      }

      $scope.selectPlayer = function (index) {
          //var getPlayerScorecard = function (playerId) {
          //    for (var i = 0; i < $scope.scorecards.length; i++) {
          //        if ($scope.scorecards[i].playerId == playerId) {
          //            return $scope.scorecards[i];
          //        }
          //    }
          //}



          console.log('index', index);
          $scope.scorecardVisible = true;

          $scope.activeScorecard = $scope.match.scorecards[index];
          //for (var i = 0; i < $scope.activeScorecard.playerScores.length; i++) {
          //    if ($scope.activeScorecard.playerScores[i].holeNumber == $scope.holeNumber) {
          //        $scope.activeScorecardHole = $scope.activeScorecard.playerScores[i];
          //    }
          //}
          $scope.activeScorecardHole = $scope.activeScorecard.playerScores[holeIndex];
          console.log($scope.activeScorecard, 'active scorevard');
      }

      $scope.$watch("activeScorecardHole", function () {
          //angular.forEach($scope.scorecards, function (obj, k) {
          //    //if (obj.selected) {
              
          //    //$scope.selectedPlayers.push(obj);
          //    //}
          //});
          $rootScope.updateCurrentMatchStorage();
          
      });

      $scope.swipeTest = function () {
          window.location = '#/match/' + matchIndex + '/' + $scope.nextHoleNumber;
      }

      // Fjernes herfra
      $scope.endMatch = function () {
          console.log('wat');
          $rootScope.publishCurrentMatch();

          setTimeout(function () {
              $rootScope.currentMatch = null;
              localStorage['currentMatch'] = null;
              window.location = "#/";
          }, 4000);
      }



  }]).filter('cmdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
  ]);

//golfchallengeControllers.controller('MatchCtrl', ['$scope', '$routeParams',
//  function ($scope, $routeParams) {
//      var matchId = $routeParams['matchId'];

//      $scope.scorecardVisible = false;
//      $scope.activeScorecard = null;

//      $scope.match = app.fetchData.match(matchId);
//      $scope.course = $scope.match.course ? $scope.match.course : {};
//      $scope.firstHoleId = 0;
//      //$scope.matchIndex = matchIndex;
//      $scope.scorecards = $scope.match.scorecards;

//      //$scope.setPlayerScore = function (score) {
//      //    $scope.activeScorecard.score = score;
//      //}

//      //$scope.setPlayerStrokes = function (strokes) {
//      //    $scope.activeScorecard.strokes = strokes;
//      //}

//      $scope.saveScorecard = function () {
//          $scope.scorecardVisible = false;
//          app.updateLocalStorage();

//          // Der er et hul, hvis dialogen bliver lukket istedet for "gem og luk",
//          // så vil scoren ligge i app.data men ikke i localstorage, før der bliver
//          // synkroniseret næste gang.
//      }

//      $scope.selectPlayer = function (index) {
//          $scope.scorecardVisible = true;
//          $scope.activeScorecard = $scope.scorecards[index];
//          console.log($scope.activeScorecard);

//      }

//      console.log($scope.match);
//      console.log('match inited');
//      //var match = {
//      //    createDate: new Date(),
//      //    id: null,
//      //    scorecards: []
//      //};

//      //$scope.date = match.createDate;
//      //$scope.players = app.data.players;
//      //$scope.selectedPlayers = [];

//      //if ($scope.players.length > 0) {
//      //    $scope.players[0].selected = true;
//      //    $scope.selectedPlayers.push($scope.players[0]);
//      //}

//      //$scope.$watch(function () {
//      //    $scope.selectedPlayers = [];
//      //    angular.forEach($scope.players, function (obj, k) {
//      //        if (obj.selected) {
//      //            $scope.selectedPlayers.push(obj);
//      //        }
//      //    });
//      //});

      








//      // create new match
//      //var newMatch = {};
//      //client.getTable("matches").insert(newMatch).done(function (response) {
//      //    $scope.newMatchId = response.id;
//      //});

//      //// init playerlist
//      ////client.getTable("players").where({name: "Peter Holmsgaard"}).read().then(function (players) {
//      //client.getTable("players").read().then(function (players) {
//      //    $scope.players = players;
//      //});



//      //$scope.selectPlayer = function (playerId) {
//      //    console.log(this, event);
//      //    console.log('Add player: ' + playerId, 'To match: ' + $scope.newMatchId);
//      //    console.log('player', playerId);
//      //    $scope.showNewPlayer = false;

//      //}

//  }]).filter('cmdate', [
//    '$filter', function ($filter) {
//        return function (input, format) {
//            return $filter('date')(new Date(input), format);
//        };
//    }
//  ]);

//golfchallengeControllers.controller('MatchHoleCtrl', ['$scope', '$routeParams',
//  function ($scope, $routeParams) {
//      // opdaterer players - skal evt. gøres efter hver indtastning
//      //app.updateLocalStoragePlayers();
//      app.updateLocalStorageScores();
//      app.updateLocalStorageScorecards();
//      //app.updateLocalStorage();

//      // Swiper!

      
//      var holeIndex = $routeParams['holeNumber'];
//      var holeNumber = Number(holeIndex) + 1;
//      var matchId = $routeParams['matchId'];

//      $scope.match = app.fetchData.match(matchId);
//      $scope.scorecards = $scope.match.scorecards;

//      console.log($scope.match.scorecards);
//      //$scope.holeScores = $scope.scorecards(hole);

//      //console.log('scorecards', $scope.scorecards);

//      $scope.holeNumber = holeNumber;
//      $scope.nextHoleNumber = holeIndex < $scope.match.course.holes.length-1 ? Number(holeIndex) + 1 : null;
//      $scope.isLastHole = $scope.nextHoleNumber == null ? true : false;

//      $scope.scorecardVisible = false;
//      $scope.activeScorecard = null;
      
//      //$scope.scorecards = $scope.match.scorecards;
//      //$scope.playerScores = [];
//      //for (var i = 0; i < $scope.scorecards.length; i++) {
//      //    for (var pi = 0; pi < $scope.scorecards[i].playerScores.length;pi++) {
//      //        if ($scope.scorecards[i].playerScores[pi].holeNumber == $scope.holeNumber) {
//      //            $scope.scorecards[i].playerScores[pi].playerName = $scope.scorecards[i].playerName;
//      //            $scope.playerScores.push($scope.scorecards[i].playerScores[pi]);
//      //        }
//      //    }
          
//      //}
//      //console.log($scope.playerScores, 'playerscores')

//      //console.log($scope.match.course.holes, 'holes');

//      for (var i = 0; i < $scope.match.course.holes.length; i++) {
//          var hole = $scope.match.course.holes[i];
//          if (hole.number == holeNumber) {
//              $scope.currentHole = hole;
//          }
//      }

//      $scope.selectPlayer = function (id) {
//          var getPlayerScorecard = function (playerId) {
//              for (var i = 0; i < $scope.scorecards.length; i++) {
//                  if ($scope.scorecards[i].playerId == playerId) {
//                      return $scope.scorecards[i];
//                  }
//              }
//          }
//          console.log(id);
//          $scope.scorecardVisible = true;
          
//          $scope.activeScorecard = getPlayerScorecard(id);
//          for (var i = 0; i < $scope.activeScorecard.playerScores.length; i++) {
//              if ($scope.activeScorecard.playerScores[i].holeNumber == $scope.holeNumber) {
//                  $scope.activeScorecardHole = $scope.activeScorecard.playerScores[i];
//              }
//          }
//          //$scope.activeScorecardHole = $scope.activeScorecard.playerScores[holeIndex];
//          console.log($scope.activeScorecard, 'active scorevard');
//      }

//      $scope.$watch(function () {
//          angular.forEach($scope.scorecards, function (obj, k) {
//              //if (obj.selected) {
//              console.log(obj);
//                  //$scope.selectedPlayers.push(obj);
//              //}
//          });
//      });

//      $scope.swipeTest = function () {
//          window.location = '#/match/' + matchIndex + '/' + $scope.nextHoleNumber;
//      }



//  }]).filter('cmdate', [
//    '$filter', function ($filter) {
//        return function (input, format) {
//            return $filter('date')(new Date(input), format);
//        };
//    }
//  ]);


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
                hcp: $scope.hcp
            });


            alert('blev ikke oprettet!');

            window.location = "#/";
        }

    }
]);

golfchallengeControllers.controller('FriendsCtrl', ['$scope',
    function ($scope) {
        console.log('friends loaded');
    }
]);