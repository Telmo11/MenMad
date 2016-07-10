(function(){
	'use strict';


	angular
		.module('mentory',['ngRoute','ngSanitize', 'ngResource','ngAlertify','lbServices','uiSwitch','ngTagsInput','ngTextTruncate','ngDialog','rzModule','ngFileUpload','ngImgCrop','ngMaterial','textAngular','opentok'])
		.controller('applicationCtrl',applicationCtrl)
		.run(run)
		.constant('authEvents', {
			LOGIN_SUCCESS: 'auth_login_success',
			LOGIN_FAILED: 'auth_login_failed',
			LOGOUT_SUCCESS: 'auth_logout_success',
			LOGOUT_FAILED: 'auth_logout_failed',
			SESSION_TIMEOUT: 'auth_session_timeout',
			NOT_AUTHENTICATED: 'auth_not_authenticated',
			NOT_AUTHORIZED: 'auth_not_authorized'
		 });
	
	
	
	//This controller is used in index.html
	applicationCtrl.$inject=["$rootScope","$scope","alertify","$location","Person","authEvents","Category","$route"];
	
	function applicationCtrl($rootScope,$scope,alertify,$location,Person,authEvents,Category,$route){
		
		var app = this;
		
		
		Category.find( {  
					filter: 	{ limit : 14 }}, 
					  function(value){
						app.categories=value;
					}, function(error){
						console.log(error);
					}); 	
		
		Person.getCurrent(function(value){app.loggedInUser=value;},function(error){});
							
	
	  	if(Person.isAuthenticated()){
			app.isAuthorized=true;
			app.isLanding=false;
			$location.path("/home");
			
		  
		}else{
		  	app.isAuthorized=false;
			app.isLanding = true; 	
		}
	  
		$rootScope.$on(authEvents.LOGIN_SUCCESS, function(event,data){
			app.isAuthorized=true;
			app.loggedInUser=$rootScope.currentUser;
			app.isLanding = false;
			
			$route.reload();
		});
		
		$rootScope.$on(authEvents.LOGOUT_SUCCESS, function(event,data){
			app.isAuthorized=false;
			$rootScope.currentUser=null;
			app.isLanding = true;
			localStorage.clear();
			
			
			$route.reload();
		});
		
	  		  	
	}
  	
	
	run.$inject = ['$rootScope', '$location', 'Person','alertify'];
	
	function run($rootScope, $location, Person,alertify) {
		
		$rootScope.$on('$locationChangeStart', function (event, next, current) {
			
			if (next.authenticate && ($rootScope.currentUser == null)) {
				
				console.log("Ha cambiado la ruta y esta :",$rootScope.currentUser);
				event.preventDefault(); //prevent current page from loading
				$location.path('/');
				
			  }
		
		});
		
		$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		  // We can catch the error thrown when the $requireAuth promise is rejected
		  // and redirect the user back to the home page
		  /*if (error === "AUTH_REQUIRED") {
			var message = '<strong> You must </strong> be logged in!';
			var id = Flash.create('warning', message); 
			$location.path("/");
		  }*/
		});
		
		
	}

})();