// cyclingController.js

(function () {

    "use strict";

    angular.module("app-cycling")
        .controller("cyclingController", cyclingController);

    function cyclingController($http) {

        var vm = this;

        vm.trips = [];
        vm.stops = [];

        vm.tripName = "";

        $http.get("http://cyclingtrips.net/api/allTrips")
            .then(function (response) {
                angular.copy(response.data, vm.trips);
            }, function (err) {
                alert("fail:" + err.status);
            });

        vm.showStops = function (trip) {
            alert(trip.name + ", " + trip.username);
            $http.get("http://cyclingtrips.net/api/allTrips/" + trip.name +
                "/" + trip.username + "/stops")
                .then(function (response) {
                    angular.copy(response.data, vm.stops);
                }, function (err) {
                    alert("(showstops)fail: " + err.status);
                });
        };



    }

})();