(function(){
	'use strict';

	angular
		.module('mentoryapp')
		.directive('headMenu',headMenu);

		
	function headMenu(){
		var directive = {
			restrict: 'EA',
			templateUrl: '/app/directives/partials/menu.html',
			controller: menuController,
			controllerAs: 'menu',
			bindToController: true,
			replace: true
		};
		return directive;
	}



	function menuController(){
		var menu = this;
		

	}

	
})();