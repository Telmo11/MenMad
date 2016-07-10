
(function(){
		'use strict';

	angular.module('mentory')
		.controller('landingCtrl',landingCtrl);

	landingCtrl.$inject = ["$location","$rootScope","alertify","Person","authEvents","$route"];

	function landingCtrl($location,$rootScope,alertify,Person,authEvents,$route) {

		var register = this;
		register.email = null;
		register.password = null;

	register.signUp= function() {
		//var o="ObjectId()";
		//console.log(register.password == null);

		if(!((register.password == null) || (register.email == null )  || (register.name == null ))) {
		var user= {
			"name" : register.name,
			"email" : register.email,
			"password" : register.password,
			"isMentor" : false,
			"created" : new Date,
			"lastUpdated" : new Date,
			"imgfront" : "https://s3-us-west-2.amazonaws.com/mentorybucket/frontimages/mentory800.jpg",
			"profileimage" : "https://s3-us-west-2.amazonaws.com/mentorybucket/profileimages/avatar.jpg",
			"imgcompany" : "https://s3-us-west-2.amazonaws.com/mentorybucket/companyimages/companybig.jpg",
			"cost" : 6
			};

		register.createUser(user);

		}else{

			alertify.delay(3000).error("¡Escribe tu nombre/email/contraseña!");

		}
	}

	register.createUser= function(user) {

		Person.create(user,
		 	function(value,responseHeaders){
				//console.log(value);
			    //console.log(responseHeaders);

				//Now you you just haved logged in.
				Person.login({rememberMe: true},{
					"email" : user.email,
					"password" : user.password
				},
				function(value,responseHeaders){

					console.log("Loggeo", value);

					$rootScope.currentUser = value.user;
					$rootScope.$broadcast(authEvents.LOGIN_SUCCESS);

					alertify.delay(3000).success("¡Bienvenido, "+value.user.name+" !");
					$location.path('/dashboard');


				},
				function(error){
					console.log(error);
					$rootScope.$broadcast(authEvents.LOGIN_FAILED);
					alertify.delay(3000).error("¡Lo sentimos, Hubo un error!");
				});

		},
		 	function(error){
					console.log(error);
					alertify.delay(3000).error("¡Lo sentimos,Hubo un error!");
		});

	}//registeruser

	register.signIn = function()
	{

		Person.login({rememberMe: true},{
			"email" : register.login.email,
			"password" : login.login.password
		},
		function(value,responseHeaders){

			console.log("Loggeo", value);
			$rootScope.currentUser = value.user;
			$rootScope.$broadcast(authEvents.LOGIN_SUCCESS);
			alertify.delay(3000).success("¡Bienvenido, "+value.user.name+" !");
			$location.path('/dashboard');
			$route.reload();
		},
		function(error){
			console.log(error);
			$rootScope.$broadcast(authEvents.LOGIN_FAILED);
			alertify.delay(3000).error("¡Lo sentimos, Hubo un error!");

		});


	}//signIn




	}




})();
