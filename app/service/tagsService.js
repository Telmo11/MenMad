

(function(){
  'use strict';

  angular.module('mentory')
     	.service('tagsService',tagsService);


//Custom service to retrieve the categories from an user
	tagsService.$inject=["$q","Category"];

  	function tagsService($q,Category){
    	var tags = this;
		tags.tags=[];



		//Asynchronusly find the categories like query string
		tags.load = function(query) {

			var deferred = $q.defer();

			//Find categories based on a query or fetch all
			Category.find({filter : {where: {name : {regexp : "/"+query+"*/" } }}},
			//Category.find({},
						 function(data){
								for(var i=0; i<data.length ; i++)
								{
									//console.log(data[i].name);
									tags.tags[i]={text : data[i].name};
								}


							},
						 	function(error){

							});

			deferred.resolve(tags.tags);
			return deferred.promise;

  		};

  }

})();
