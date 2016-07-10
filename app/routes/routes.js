(function(){
	'use strict';

	angular
		.module('mentory')
		.config(configuration);

	configuration.$inject =['$routeProvider', 'LoopBackResourceProvider','$httpProvider'];
	function configuration($routeProvider, LoopBackResourceProvider,$httpProvider){

		$httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
		  return {
			responseError: function(rejection) {

				/*if (rejection.status == 401) {
				//Now clearing the loopback values from client browser for safe logout...
				LoopBackAuth.clearUser();
				LoopBackAuth.clearStorage();
				$location.nextAfterLogin = $location.path();
				$location.path('/login');
			  }*/

				 /*if (rejection.status == 500) {
				//Now clearing the loopback values from client browser for safe logout...
				LoopBackAuth.clearUser();
				LoopBackAuth.clearStorage();
				$location.nextAfterLogin = $location.path();
				$location.path('/login');
					 app.isAuthorized=false;
			  }*/


			  return $q.reject(rejection);
			}
		  };
		});

		// Use a custom auth header instead of the default 'Authorization'
		LoopBackResourceProvider.setAuthHeader('X-Access-Token');


		$routeProvider
		.when('/',
        {
          templateUrl : './app/views/landing/landing.html',
          controller  : 'landingCtrl',
          controllerAs: 'register',
          resolve : {

          }
        })
		 .when('/home',
        {
          templateUrl : './app/views/home/home-controller.html',
          controller  : 'homeCtrl',
          controllerAs: 'home',
          resolve : {
				// controller will not be loaded until $waitForAuth resolves
			     "currentAuth" : ["Person" ,function(Person){
					Person.isAuthenticated();
				}] , "users" : ["Person" ,function(Person){
					return Person.find( {
					filter: 	{ limit : 25 , include: ["categories"] }});
				}], "categories" : ["Category" ,function(Category){
					return Category.find( {
					filter: 	{ limit : 50 }});
				}]
          },
			authenticate: true
        })
		.when('/discover/:category',
        {
          templateUrl : './app/views/home/discover-controller.html',
          controller  : 'discoverCtrl',
          controllerAs: 'discover',
          resolve : {
				// controller will not be loaded until $waitForAuth resolves
						"people" : ["$route","Person" ,function($route,Person){
					 return Person.find({ filter: {

								 include: {
									 relation : "categories",
									 scope: {
										 where : {
											 "name" : {"regexp": "/"+$route.current.params.category+"*/i" }
										 }
									 }
								 }
							 }});
				 }],"categories" : ["Category" ,function(Category){
 					return Category.find( {
 					filter: 	{ limit : 50 }});
 				}]
				
          }
        })
		.when('/search/:query',
        {
          templateUrl : './app/views/home/search-controller.html',
          controller  : 'searchCtrl',
          controllerAs: 'search',
          resolve : {
				// controller will not be loaded until $waitForAuth resolves
			     "people" : ["$route","Person" ,function($route,Person){
					return Person.find({ filter: {

		            include: {
		              relation : "categories",
		              scope: {
		                where : {
		                  "name" : {"regexp": "/"+$route.current.params.query+"*/i" }
		                }
		              }
		            }
		          }});
				}]
          }
        })
		.when('/login',
        {
          templateUrl : './app/views/login/login.html',
          controller  : 'loginCtrl',
          controllerAs: 'login',
          resolve : {

          }
        })
        .when('/live/:sessionid',
        {
          templateUrl : './app/views/live/live.html',
          controller  : 'liveCtrl',
          controllerAs: 'live',
          resolve : {
			  booking : ["$route","Book",function($route,Book){
						return Book.findOne({
						  filter: { where: { sessionid : $route.current.params.sessionid } }
						});
					}]

          }
        })
        .when('/agenda',
        {
          templateUrl : './app/views/agenda/agenda.html',
          controller  : 'agendaCtrl',
          controllerAs: 'agenda',
          resolve : {

          }
        })
        .when('/jobs',
        {
          templateUrl : './app/views/jobs/jobs.html',
          controller  : 'jobsCtrl',
          controllerAs: 'jobs',
          resolve : {

          }
        })
		.when('/profile/:id',
        {
          templateUrl : './app/views/profile/public-profile.html',
          controller  : 'profileCtrl',
          controllerAs: 'profile',
          resolve : {
			  currentProfile : ["$route","Person",function($route,Person){
					return Person.findById({ id: $route.current.params.id ,
					filter: 	{ include : 'categories'}

							  });
				}]


          },
		  authenticate: true
        })
		.when('/dashboard',
        {
          templateUrl : './app/views/dashboard/dashboard.html',
		  controller  : 'dashCtrl',
          controllerAs: 'main',
          resolve : {

          },
		  authenticate: true
        })
      .otherwise({
        redirectTo : '/'
      });
  	}




})();
