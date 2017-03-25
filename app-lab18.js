// MODULE
// Add the dependency ng-route and ng-resource
var weatherApp = angular.module('weatherApp',['ngRoute','ngResource']);


// CONTROLLERS
weatherApp.controller('homeController',['$scope', 'cityService', function($scope, cityService){
    $scope.city = cityService.city;

    $scope.$watch('city',function(){
        cityService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController',['$scope', '$resource','$routeParams','cityService', function($scope, $resource, $routeParams, cityService){
    $scope.city = cityService.city;

    $scope.days = $routeParams.days || '2'; // get the no. of days from the routeParam as query parameter and if no values passed, default it to 2 days.

    $scope.APIKEY = "9859a5d6386b7d482747ff0fea2059d7"; //  Registered and got from http://openweathermap.org

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast", {callback: "JSON_CALLBACK"}, {get: {method:"JSONP"}});

    $scope.temperatureResult = $scope.weatherAPI.get({q: $scope.city, cnt:$scope.days, appid:$scope.APIKEY});

    console.log($scope.temperatureResult);

    $scope.convertToFahrenheit = function(degreeInKelvin){
        console.log("degreeInKelvin ["+degreeInKelvin+"]");
        return Math.round((1.8 * (degreeInKelvin - 273)) + 32);
    }

    $scope.convertToDate = function(dateVal){
        console.log("dateVal ["+dateVal+"]");
        return new Date(dateVal * 1000);
    }


}]);


// ROUTES
weatherApp.config(function($routeProvider){

    $routeProvider

        .when('/',{
            templateUrl: 'pages/home.htm',
            controller: 'homeController'
        })

        .when('/forecast',{
            templateUrl: 'pages/forecast.htm',
            controller: 'forecastController'
        })

        .when('/forecast/:days',{
            templateUrl: 'pages/forecast.htm',
            controller: 'forecastController'
        })
        //http://localhost:63342/Lab18-WeatherForecast-SPA/index.html#/forecast/4
        //http://localhost:63342/Lab18-WeatherForecast-SPA/index.html#/forecast/7
});

// CUSTOM SERVICE
// Here Custom service used to share data between the pages
weatherApp.service('cityService', function(){
    this.city = "New York, NY";
 });

// CUSTOM DIRECTIVE
// Write custom directive for getting the Weather results which can be used in many pages
weatherApp.directive('weatherReport',function(){
    return{
        // Restrict the directive to work fo HTML only - 'AECM'
        restrict: 'E',
        //template: '<p>TEST MESSAGE</p>',
        templateUrl: 'directives/weather.html',
        replace: false, // strange: Throwing error when used 'true' - Error: Template for directive '{0}' must have exactly one root element. {1}
        scope: {
            // Need to pass the weather Object
            weatherDay: "=",

            // Need to pass the functions

            convertToStandardFaren: "&",
            convertToStandardDate: "&",

            // Need to pass the string - 2 way binding
            dateFormat: "@"
        }
    }
});