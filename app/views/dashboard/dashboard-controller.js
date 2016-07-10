(function(){
  'use strict';

 angular.module('mentory')
    .controller('dashCtrl',dashCtrl);

 //Controller for /dashboard
 dashCtrl.$inject=['$rootScope','Person','$location','alertify','ngDialog','authEvents'];

  function dashCtrl($rootScope,Person,$location,alertify,ngDialog,authEvents){
    var main = this;

    main.sliderOptions = {
        floor: 50,
        ceil: 150,
        step: 1

    };

    main.saveCost = function(){
      main.user.cost = main.cost;
      main.user.$save();
      alertify.delay(5000).success("Se ha guardado tu costo.");
    }

    Person.getCurrent(function(response){

			main.user = response;
      main.cost = main.user.cost;
      console.log(main.user);

		},function(error){

		});

	 main.logOut = function(){

		 Person.logout(
					function(value,responseHeaders){

						$rootScope.$broadcast(authEvents.LOGOUT_SUCCESS);
						$rootScope.currentUser=null;
						localStorage.clear();
						alertify.delay(3000).success("¡Esperamos verte pronto !");
						$location.path('/');
						window.location.reload();
				},
					function(error){
						console.log(error);
				});

	 }


  }


})();
