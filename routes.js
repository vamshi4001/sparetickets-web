angular.module("sparetickets")
    .config(function ($routeProvider) {
        $routeProvider
          .when('/', {
              templateUrl: 'movies/movielist.html',
              controller: 'movieController'
          })
          .when('/home', {
              templateUrl: 'movies/home.html',
              controller: 'movieController'
          })
          .when('/book', {
            templateUrl: 'movies/booking.html',
            controller: 'bookingController'
          })
          .when('/movie/:movieid', {
            templateUrl: 'movies/booking.html',
            controller: 'bookingController'
          })
          .when('/trailers', {
            templateUrl: 'trailers/trailers.html',
            controller: 'trailersController'
          })
          .when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginController'
          })
          .when('/contact', {
            templateUrl: 'contact/contact.html',
            controller: 'contactController'
          })
          .otherwise({
              redirectTo: '/'
          });          
    })  
    .run(function($rootScope, $location, $anchorScroll, $routeParams) {
      //when the route is changed scroll to the proper element.
      $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();  
      });
    });