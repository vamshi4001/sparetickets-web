angular.module("sparetickets")
.controller("movieController",['$http','$scope','$rootScope', '$location', 'UtilitiesService', function($http, $scope, $rootScope, $location, UtilitiesService){
	$scope.movies = [];
	$scope.search = "";
	var url = UtilitiesService.getUrlPrefix()+"/getMovies.json?cityid=1";
	UtilitiesService.makeAjaxCalls(url,"","GET").then(function(response){
		if(response.data.isSuccess){
			$scope.movies = response.data.result
		}
	})	  
}])