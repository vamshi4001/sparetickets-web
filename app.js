angular.module("sparetickets",[
	'ui.router',
	'ngRoute', 
	'ngCookies',
	'facebook'
])	
.config(['FacebookProvider',function(FacebookProvider) {
     var myAppId = '1430914467223678';
     FacebookProvider.init(myAppId);     
}])