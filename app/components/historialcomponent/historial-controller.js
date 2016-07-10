(function(){
	'use strict';

	var historialComponent = {
		templateUrl : '/app/components/historialcomponent/historial.html',
		controller : mainCtrl
	};

	angular
		.module('mentory')
		.component('historialComponent',historialComponent);
	
  	
 //Controller for <historial-component>
  function mainCtrl(Mentory,Category,Person,$http,tagsService,$location,$rootScope,Book){
 
	  var main = this;		  
	  main.booksToYou=[];
	  main.booksFromYou=[];
	  
	   Person.getCurrent(function(response){
			
			main.user=response;
		    

		});
	   
			  
	  //Fetch the bookings of this user or made by this user
	  Book.find( {
		  	
		  filter: 
					{
						//include: ['person',{mentory:'person'}]
						include : ['person','booked']

					}/*,
					{
		  				where :
					}*/
				},
			function(data){
		  
		  		 main.bookings=data;
		  		
				  //Reducimos todos los bookings a solo aquellos en los que está este usuario como destino (Le llego una cita)
				   Person.getCurrent(function(resp){

						//Iterate all the bookings and show only those which this person is target
					   for(var i=0,j=0; i < main.bookings.length; i++)
					   {

						   if(main.bookings[i].iduserbooked == resp.iduser) //if the mentory of this booking has the iduser of this person, show it
							{

								main.booksToYou[j] = main.bookings[i]; 

								j++;

							}

					   }
					   
					   

				   }, function(error){

					});//Person.getCurrent
		  
		  


				   //Reducimos todos los bookings a solo aquellos en los que está este usuario como origen. (Realizo una cita)
				   Person.getCurrent(function(respon){

						//Iterate all the bookings and show only those which this person is owner or she made a booking
					   for(var i=0,j=0; i < main.bookings.length; i++)
					   {
						   //If the booking has the iduser of this person, show it
						   if(main.bookings[i].iduser == respon.iduser)
						   {

								main.booksFromYou[j] = main.bookings[i];


							   j++;

						   }

					   }

				   }, function(error){

				   });
		  

			},
			function(error){

			});//Book.find()
	  
	  
	  
	  main.confirm= function(booking){
		  if(booking.confirmeddate){
			  //booking.confirmeddate = main.probDate1;
			  //console.log(typeof booking.idbook);
			  var obj = {
				"idbook" : booking.idbook,
				"confirmeddate" : booking.confirmeddate 
			  };
			  
			  
			  Book.confirm(obj, function(data){
				  console.log(data);
				  
			  });
			  
			  alertify.delay(5000).success("Se ha confirmado tu cita.");
			  alertify.delay(5000).success("Te llegará un correo con toda la información para la mentoria");
			  $location.path("/profile/"+main.user.iduser);
		  }else{
			  alertify.delay(3000).error("Selecciona una fecha propuesta.");
		  }
		  
		  
	  }
			  
	
	
	 
	  
	  
	   
		   
	  
  }
})();