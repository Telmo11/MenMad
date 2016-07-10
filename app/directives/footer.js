(function(){
	'use strict';

	angular
		.module('mentoryapp')
		.directive('footMenu',footMenu);


	function footMenu(){
		var directive = {
			restrict: 'EA',
			templateUrl: '/app/directives/partials/footer.html',
			controller: footerController,
			controllerAs: 'foot',
			bindToController: true,
			replace: true
		};
		return directive;
	}



	function footerController(){
		var foot = this;
		

	}

})();