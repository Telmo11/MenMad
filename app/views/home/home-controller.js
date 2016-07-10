(function(){
  'use strict';

  angular.module('mentory')
    .controller('homeCtrl',homeCtrl)
	.controller('discoverCtrl',discoverCtrl)
	.controller('searchCtrl',searchCtrl);

 //Controller for /home
 homeCtrl.$inject=['currentAuth','users','categories','Mentory','Category','Person','$http','tagsService','$location','alertify','ngDialog','string_utils'];

  function homeCtrl(currentAuth,users,categories,Mentory,Category,Person,$http,tagsService,$location,alertify,ngDialog,string_utils){
    var home = this;



	users.$promise.then(function(response){
		//console.log(response);

		home.users=response;
	});


	categories.$promise.then(function(response){
		//console.log(response);

		home.categories=response;


	});

    var users_found = [];
	  home.goTo = function()
	  {

		  $location.path("/search/"+home.searchText);

	  }

	 home.goToProfile = function(iduser){
		 $location.path("/profile/"+iduser);
		 //console.log(idmentory);
	 }

    home.querySearch = function(query){
      return string_utils.getCategories(query);
    }



  }


//Controller for /discover/:category
 discoverCtrl.$inject=['people','categories','Mentory','Category','Person','$routeParams','$location'];

  function discoverCtrl(people,categories,Mentory,Category,Person,$routeParams,$location){
    var discover = this;
    discover.people = [];
    discover.searchCost = 4;
    discover.maxCost = 15;

    discover.sliderOptions = {
      floor: 4,
      ceil: 20,
      step: 1
    };
	people.$promise.then(function(response){
		//console.log(response);
    for(var i = 0; i < response.length ; i++){
      //console.log(response[i]);
      if(response[i].categories.length > 0){
          discover.people.push(response[i]);
      }
    }
    //console.log(discover.people);
	});

  categories.$promise.then(function(response){
    //console.log(response);
    discover.categories = response;
  });

   discover.sortCost = function(user){
     return user.cost > discover.searchCost && user.cost < discover.maxCost;
   }

   discover.goToDiscover = function(name){
     $location.path("/discover/"+name);
   }



	  discover.category=$routeParams.category;
	  discover.categoryToShow=discover.category;
	  discover.category=discover.category.toLowerCase();


	 discover.goToProfile = function(iduser){
		 $location.path("/profile/"+iduser);
		 //console.log(idmentory);
	 }

  }//discoverCtrl


 //Controller for /search/:mentory
 searchCtrl.$inject=['people','Mentory','Category','Person','$routeParams','$location'];

  function searchCtrl(people,Mentory,Category,Person,$routeParams,$location){
    var search = this;
    search.search=$routeParams.query;
    search.people = [];

	people.$promise.then(function(response){
		console.log(response);

    for(var i = 0; i < response.length ; i++){
      if(response[i].categories.length > 0){
          search.people.push(response[i]);
      }

    }

    console.log(search.people);

	});

	  search.goTo = function()
	  {
		  $location.path("/search/"+search.query);
	  }

	  search.goToProfile = function(iduser){
		 $location.path("/profile/"+iduser);
		 //console.log(idmentory);
	 	}


  }//searchCtrl


})();
