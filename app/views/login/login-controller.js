(function(){
  'use strict';

  angular.module('mentory')
    .controller('loginCtrl',loginCtrl);

	loginCtrl.$inject = ["$location","$rootScope","alertify","Person","authEvents"];

  function loginCtrl($location,$rootScope,alertify,Person,authEvents){
    
	var login = this;
	login.email = null;
	login.password = null;

	
	  
	login.signIn = function()
	{
		
		Person.login({rememberMe: true},{
			"email" : login.email,
			"password" : login.password
		},
		function(value,responseHeaders){
			
			console.log("Loggeo", value);
		
			$rootScope.currentUser = value.user;	
			$rootScope.$broadcast(authEvents.LOGIN_SUCCESS);
			
			
			
			alertify.delay(3000).success("!Bienvenido, de vuelta!");
			$location.path('/home');
			
		},
		function(error){
			console.log(error);
			$rootScope.$broadcast(authEvents.LOGIN_FAILED);
			
			
			alertify.delay(3000).error("Lo sentimos no hemos podido acceder a su cuenta");
			
		});
		
		
	}
	

	
	
  }

})();
	