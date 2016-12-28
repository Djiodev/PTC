// cyclingController.js

(function () {

    "use strict";

    angular.module("app-cycling")
        .controller("cyclingController", cyclingController);

    function cyclingController($http) {

        var vm = this;

        vm.trips = [];
        vm.stops = [];
        vm.stopStats = [];

        vm.tripName = "";

        $http.get("http://cyclingtrips.net/api/allTrips")
            .then(function (response) {
                angular.copy(response.data, vm.trips);
            }, function (err) {
                alert("fail:" + err.status);
            });

        vm.showStops = function (trip) {
            console.log(trip.name + ", " + trip.username);
            $http.get("http://cyclingtrips.net/api/allTrips/" + trip.name +
                "/" + trip.username + "/stops")
                .then(function (response) {
                    angular.copy(response.data, vm.stops);
                }, function (err) {
                    alert("(showstops)fail: " + err.status);
                });
        };

        vm.stats = function () {
            getStats(vm.stops);
            setTimeout(function () {
                for (var i = 0; i < vm.stopStats.origin_addresses.length; i++) {
                    console.log(vm.stopStats.origin_addresses[i] + " to " + vm.stopStats.destination_addresses[i] +
                    ": " + vm.stopStats.rows[i].elements[i].distance.text + "\r\n");
                    };
                //console.log(vm.stopStats.origin_addresses[0] + " to " + vm.stopStats.destination_addresses[0] +
                //    ": " + vm.stopStats.rows[0].elements[0].distance.text + "\r\n" +
                //    vm.stopStats.origin_addresses[1] + " to " + vm.stopStats.destination_addresses[1] +
                //    ": " + vm.stopStats.rows[1].elements[1].distance.text);
            }, 1000);
        };

        var getStats = function (stops) {
            var origins = stops[0].location;
            var destinations = stops[1].location;
            for (var i = 1; i < stops.length - 1; i++) {
                origins += "|" + stops[i].location;
                destinations += "|" + stops[i + 1].location;
            };

            console.log("origins: " + origins + "\r\ndestinations: " + destinations);

            var tripStats = [];
            $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + origins +
            "&destinations=" + destinations + "&mode=driving&key=AIzaSyDLEU3W2SbHKPHzQrGvzsfwRz5SUm8IIHc")
            .then(function (response) {
                angular.copy(response.data, vm.stopStats);
            }, function (err) {
                alert("fail google maps");
            });

        };

    }

})();