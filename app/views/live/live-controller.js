(function(){
	'use strict';

		angular.module('mentory')
			.controller('liveCtrl',liveCtrl);
	
			liveCtrl.$inject = ['booking', 'OTSession'] ;
						
			function liveCtrl(booking, OTSession) {
				var live = this;
				
				booking.$promise.then(function(response){
					console.log("Conectando a ", response);
					live.booking = response;
					live.apiKey = '45573122';
					live.sessionId = live.booking.sessionid,
					live.token = live.booking.codeMentor;

					OTSession.init(live.apiKey, live.sessionId, live.token);
					live.session = OTSession.session;
					live.streams = OTSession.streams;
					
					console.log(live.streams);
				});
				
               
            };
				
	
			
})();