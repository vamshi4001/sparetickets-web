angular.module("sparetickets")
.controller("bookingController",['$http','$scope','$rootScope', '$location','UtilitiesService', function($http, $scope, $rootScope, $location, UtilitiesService){
	$scope.showtimes = {};
	$scope.theatres = [];
	$scope.formatDate = UtilitiesService.formatDate;
	$scope.loadTheatres = function(id){
		var url = UtilitiesService.getUrlPrefix()+"/getTheatres.json?cityid=1&movieid="+id;
		UtilitiesService.makeAjaxCalls(url,"","GET").then(function(response){
			$scope.theatres = response.data.result;
			$($scope.theatres).each(function(i,v){
				var requrl = UtilitiesService.getUrlPrefix()+"/getShows.json?movieid="+id+"&theatreid="+v.id+"&cityid=1";
				UtilitiesService.makeAjaxCalls(requrl,"","GET").then(function(result){
					$scope.showtimes[v.id] = {};
					$(result.data.result).each(function(a,b){
						if($scope.showtimes[v.id][b.date]){
							$scope.showtimes[v.id][b.date].push(b);
						}
						else{
							$scope.showtimes[v.id][b.date] = [];
							$scope.showtimes[v.id][b.date].push(b);
						}
					})
					$scope.showtimes[v.id].dates = Object.keys($scope.showtimes[v.id]);
				})				
			})
		})
	} 
	$scope.selectShowTime = function(showtime, $event) {
		$(".time-select__item").removeClass("active");
		$($event.target).addClass("active");
	}
	$scope.loadTheatres($location.path().split("/")[$location.path().split("/").length-1]);
}])