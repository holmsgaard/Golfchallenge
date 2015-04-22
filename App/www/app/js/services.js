var golfchallengeServices = angular.module('golfchallengeServices', []);

golfchallengeServices.factory('serviceMatches', [function () {
    var service = {
        fetch: function () {
            var promise = client.getTable("matches").read().then(function (response) {
                return response;
            });
            return promise;
        },
        getCourseById: function (id) {
            var promise = client.getTable("courts").where({ id: id }).read().then(function (response) {
                return response;
            });
            return promise;

        }
    };

    return service;
}]);

//golfchallengeServices.factory('serviceCourseById', [function (id) {
//    var service = {
//        fetch: function () {
//            var promise = client.getTable("courts").where({id: id}).read().then(function (response) {
//                return response;
//            });
//            return promise;
//        }
//    };

//    return service;
//}]);

