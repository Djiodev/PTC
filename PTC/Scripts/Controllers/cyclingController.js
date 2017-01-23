// cyclingController.js

(function () {

    "use strict";

    angular.module("app-cycling")
        .controller("cyclingController", cyclingController);

    function cyclingController($http, $filter, $scope) {

        var vm = this;

        vm.trips = [];
        vm.stops = [];
        vm.stopStats = [];
        vm.locationsElevation = [];

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

            var routes = getDistances(vm.stops);
            var elevations = getElevations(vm.stops);

            var distancesChartData = {
                labels: [],
                distances: []
            };

            

            setTimeout(function () {
                for (var i = 0; i < routes.origins.length; i++) {
                    distancesChartData.labels.push(routes.origins[i] + " TO " + routes.destinations[i]);
                    distancesChartData.distances.push(routes.distances[i]);

                };
                
            }, 1000);
            setTimeout(function () {
                $('#distancesChart').remove(); // this is my <canvas> element
                $('#distancesChartContainer').append('<canvas id="distancesChart"><canvas>');
                var chart = $('#distancesChart');
                var tripsChart = new Chart(chart, {
                    type: 'bar',
                    data: {
                        labels: distancesChartData.labels,
                        datasets: [{
                            label: 'Travel Distance',
                            data: routes.distances,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            }, 1500);
            setTimeout(function () {
                $('#elevationChart').remove();
                $('#elevationChartContainer').append('<canvas id="elevationChart"><canvas>');
                var chart = $('#elevationChart');
                var tripsChart = new Chart(chart, {
                    type: 'line',
                    data: {
                        labels: elevations.location,
                        datasets: [{
                            label: "Location Elevation",
                            fill: false,
                            lineTension: 0.4,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: elevations.locationElevation,
                            spanGaps: false,
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            }, 2000);


        };

        var getDistances = function (stops) {

            var routes = {
                originsLatLng: [],
                origins: [],
                destinationsLatLng: [],
                destinations: [],
                distances: []
            };
            for (var i = 0; i < stops.length - 1; i++) {
                var originLatLng = new google.maps.LatLng({ lat: stops[i].latitude, lng: stops[i].longitude });
                var destinationLatLng = new google.maps.LatLng({ lat: stops[i + 1].latitude, lng: stops[i + 1].longitude });

                routes.originsLatLng.push(originLatLng);
                routes.origins.push(stops[i].location);
                routes.destinationsLatLng.push(destinationLatLng);
                routes.destinations.push(stops[i + 1].location);
            };

            var distance = new google.maps.DistanceMatrixService();
            distance.getDistanceMatrix({
                origins: routes.originsLatLng,
                destinations: routes.destinationsLatLng,
                travelMode: 'DRIVING'
            }, function (results, status) {
                console.log("Status: " + status + "");
                if (status == 'OK') {
                    for (var i = 0; i < results.rows.length; i++) {
                        console.log("ORIGIN: " + results.originAddresses[i] +
                            "\r\nDESTINATION: " + results.destinationAddresses[i] +
                            "\r\nDISTANCE: " + results.rows[i].elements[i].distance.value / 1000);
                        routes.distances.push(Math.round(results.rows[i].elements[i].distance.value / 1000));
                    }
                }
            });
            return routes;
        };

        var getElevations = function (stops) {

            var elevator = new google.maps.ElevationService();
            var elevations = {
                locationLatLng: [],
                location: [],
                locationElevation: []
            };


            for (var i = 0; i < stops.length; i++) {
                var locationLatLng = new google.maps.LatLng({ lat: stops[i].latitude, lng: stops[i].longitude });
                elevations.locationLatLng.push(locationLatLng);
                elevations.location.push(stops[i].location);
            };

            elevator.getElevationForLocations({
                'locations': elevations.locationLatLng
            }, function (results, status) {
                console.log("ELEVATION! Status: " + status);
                if (status == 'OK') {
                    
                    for (var i = 0; i < results.length; i++) {
                        console.log("Status: " + status + ". Location: " + results[i].location + ". Elevation: " + results[i].elevation);
                        elevations.locationElevation.push(results[i].elevation);
                    }
                }


            });

            return elevations;
        };

    }

})();