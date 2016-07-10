(function(){
  'use strict';

  angular.module('mentory')
     	.service('string_utils',stringService);


  //Custom service that exposes several utilities for string issues
	stringService.$inject=["$q","Category"];

  	function stringService($q,Category){

      /* Normalize a string*/
      var normalize = (function() {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

        for(var i = 0, j = from.length; i < j; i++ )
            mapping[ from.charAt( i ) ] = to.charAt( i );

        return function( str ) {
            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }
            return ret.join( '' );
        }

      })();

      var categories = [];

      var getCategories = function(query) {

  			var deferred = $q.defer();

  			//Find categories based on a query or fetch all
  			Category.find({filter : {where: {name : {regexp : "/"+query+"*/i" } }}},
  			//Category.find({},
  						 function(data){
  								categories = data;

  							},
  						 	function(error){

  							});

  			deferred.resolve(categories);
  			return deferred.promise;

      };

      return {
          normalize : normalize,
          getCategories : getCategories
      }


  }

})();
