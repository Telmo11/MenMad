(function(){
	'use strict';

	angular
		.module('mentoryapp')
		.directive('listMentores',listMentores);

		
	function listMentores(){
		var directive = {
			restrict: 'EA',
			templateUrl: '/app/directives/partials/grild-mentores.html',
			controller: listController,
			controllerAs: 'list',
			bindToController: true,
			replace: true
		};
		return directive;
	}



	function listController(){
		var list = this;
		

	}

	
})();