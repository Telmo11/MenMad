(function(){
  'use strict';

  angular.module('mentory')
    .controller('newMentoryCtrl',newMentoryCtrl)
  	.controller('editMentoryCtrl',editMentoryCtrl)
	.controller('mentoriesCtrl',mentoriesCtrl)
  	.controller('mentoryCtrl',mentoryCtrl);

	
	//Controller for /newMentory
  newMentoryCtrl.$inject=['currentUser','Mentory','Category','Person','$http','tagsService','$location','Flash'];
	
  function newMentoryCtrl(currentUser,Mentory,Category,Person,$http,tagsService,$location,Flash){
    var mentory = this;
	
	 currentUser.$promise.then(function(response){
			//console.log(response);	
			mentory.user = response;

		});
	 
	mentory.loadItems= function(query)
	{
		
		return tagsService.load(query);
		
	}

	  
	mentory.addMentory = function()
	{
		mentory.new.created= new Date();
		//Create a mentory related to this user and add the related categories
		Person.mentories.create({id : mentory.user.iduser},mentory.new,
				 function(data){
				console.log(data);
				
				mentory.user.mentory=data;
			
				
			
				for(var i=0; i<mentory.categories.length; i++)
				{
					mentory.categories[i].text =mentory.categories[i].text.replace(/-/g, " ");
					//console.log(mentory.categories[i].text);
					//Search the id from the categories selected
					Category.findOne({filter: { where : { name : mentory.categories[i].text }}},
										function(value){
											var fk_category=value.idcategory;
											
						
											//Now link the idcategory with the idmentory
											Mentory.categories.link({id:mentory.user.mentory.idmentory, fk:fk_category},null).$promise.then(
												function(sucess){
												  console.log(sucess);
													
												
												},
												function(error){
													console.log(error);
													//-- 404 error retuned
													var message = '<strong>Error!</strong> ' + error;
													var id = Flash.create('danger', message);	
													
												 }
											 );
					
										},
										function(error){
											var message = '<strong>Error!</strong> ' + error;
											var id = Flash.create('danger', message);	
										});
										
				}
			
				var message = '<strong>Success!</strong> You just have added one mentory! ';
				var id = Flash.create('success', message);
				$location.path('/mentory/'+data.idmentory);
					
		},
				 function(error){
			
		});
		
	}
    
  }
	
	
 //Controller for /myMentories
  mentoriesCtrl.$inject=['currentUser','Mentory','Category','Person','$http','$location','Flash','$route'];
	
  function mentoriesCtrl(currentUser,Mentory,Category,Person,$http,$location,Flash,$route){
    var mentory = this;
	
	 currentUser.$promise.then(function(response){
			//console.log(response);	
			mentory.user = response;
		 
		 	//Fetch the user mentories with their own categories
			Person.mentories( { id: mentory.user.iduser ,  
					filter: 	{ include : 'categories'}},
			  function(value){


				mentory.user.mentories=value;	


			  },
			  function(error){
				var message = '<strong>Error!</strong> ' + error;
				var id = Flash.create('danger', message);	
			  });

		 

		});
	  
	  
	  
		mentory.deleteMentory = function(idMentory)
		{			
			
			//Delete the link between categories and mentory
			Mentory.categories({id: idMentory},
		  	function(data){
				console.log(data);
				
				 //Delete the mentory itself
				Mentory.deleteById({ id: idMentory })
				  .$promise
				  .then(function() { console.log('deleted'); });
				
				
				//Iterate the categories and then unlink with this category
				for(var i=0; i<data.length;i++)
				{
					//Destroy the link between user and the category
					Mentory.categories.unlink({id:idMentory, fk:data[i].idcategory},null).$promise.then(
					function(sucess){
					  	//console.log(sucess);
							var message = '<strong>Success!</strong> You just have deleted a mentory' ;
							var id = Flash.create('success', message);	
							},
						function(error){
							console.log(error);
							
						 });
					
				}
				
				$route.reload();

				},
				
			  function(error){
				console.log(error)
	
			
				});
			
		}//deleteMentory
	  
  }
	
	
	//Controller for /editmentory/:id
  editMentoryCtrl.$inject=['currentMentory','Mentory','Category','Person','$http','tagsService','$location','Flash'];
	
  function editMentoryCtrl(currentMentory,Mentory,Category,Person,$http,tagsService,$location,Flash){
    	var mentory = this;
	  	mentory.categoriesTags=[];
	  
	  currentMentory.$promise.then(function(response){
			//console.log(response);	
			mentory.mentory = response;
		 	console.log(response);
		 	
		  
			for(var i=0; i<mentory.mentory.categories.length ; i++)
			{
				
				mentory.categoriesTags[i]={text : mentory.mentory.categories[i].name};
			}


		  
		  	
 
		});
	 
	  //Asynchronusly call the items for the expertise tags input from the tagsService
		mentory.loadItems= function(query)
		{
				
				return tagsService.load(query);

		}
		
		mentory.updateMentory = function(){
			
				
			Mentory.findById({id: mentory.mentory.idmentory},
				function(data){
					
					delete mentory.mentory.categories;
					data=mentory.mentory;
					
					console.log(data);
					
					//data.$save();
					var message = '<strong>Success!</strong> You just have updated your mentory! ';
					var id = Flash.create('success', message);
				},function(error){
					var message = '<strong>Error!</strong> ' + error;
					var id = Flash.create('danger', message);	
				}
				
			);
			//edit.user.$save();
		}
		
		
		mentory.addCategory = function(tag){
			
				tag.text=tag.text.replace(/-/g, " ");
				//Find the first instance of the selected category and then link to the current user
				Category.find({filter: { where : { name : tag.text }}},
										function(value){
											
											
											var fk_category=value[0].idcategory;
											//console.log("fk : ",fk_category);
											//console.log("iduser : ",edit.user.iduser);
											Mentory.categories.link({id:mentory.mentory.idmentory, fk:fk_category},null).$promise.then(
												function(sucess){
												  console.log(sucess);
												  
													Mentory.categories( {id: mentory.mentory.idmentory},   
														  function(value){
															mentory.mentory.categories=value;	
													  		var message = '<strong>Success!</strong> You just have added one category! ';
															var id = Flash.create('success', message);

														  },
														  function(error){
													  		var message = '<strong>Error!</strong> ' + error;
															var id = Flash.create('danger', message);	
														  });
												},
												function(error){
													console.log(error);
													//-- 404 error retuned
													var message = '<strong>Error!</strong> ' + error;
													var id = Flash.create('danger', message);	
												 }
											 );
					
										},
										function(error){
											var message = '<strong>Error!</strong> ' + error;
											var id = Flash.create('danger', message);	
										});
				
				
				
				
				//Person.categories.link({id: edit.user.iduser, fk: fk_category})
				
				
				
			
			
		}
		
		mentory.deleteCategory= function(tag) {
			
			tag.text=tag.text.replace(/-/g, " ");
			Category.findOne({ 
			  filter: { where: { name: tag.text} }
			},
		  	function(data){
				
				
				//Destroy the link between user and the selected category
				Mentory.categories.unlink({id:mentory.mentory.idmentory, fk:data.idcategory},null).$promise.then(
				function(sucess){
				  console.log(sucess);
				  
				  var message = '<strong>Success!</strong> You just have deleted one category! ';
				  var id = Flash.create('success', message);
				
				},
				function(error){
					console.log(error);
					var message = '<strong>Error!</strong> ' + error;
					var id = Flash.create('danger', message);	
				 }
			 );
				
			},
				
			  function(error){
				console.log(error)
					var message = '<strong>Error!</strong> ' + error;
					var id = Flash.create('danger', message);	});
			
			
		}
	  
  }
	
	
  //Controller for /mentory/:id
  mentoryCtrl.$inject=['currentMentory','Mentory','Category','Person','$http','tagsService','$location','Flash','ngDialog'];
	
  function mentoryCtrl(currentMentory,Mentory,Category,Person,$http,tagsService,$location,Flash,ngDialog){
    var mentory = this;
	
	

	  
	  currentMentory.$promise.then(function(response){
			
			mentory.mentory = response;	
		  	
	 
		});
	  
	  
	  
	  

	  mentory.clickToOpen = function () {
         ngDialog.open({ template: 'templateReservation', className: 'ngdialog-theme-default', 
						controller: ['$scope','currentUser','Book', function($scope,currentUser,Book) {
							// controller logic
							
							$scope.book={};
								
							currentUser.$promise.then(function(response){
									//console.log(response);	
									 $scope.book.iduser=response.iduser;
							
								});
								 
							$scope.book.idmentory=mentory.mentory.idmentory;
							
							 $scope.reserveMentory = function(){
								 
								 
								 $scope.book.reason=$scope.reason;
								 $scope.book.estimatedTime=$scope.estimatedTime;
								 $scope.book.probDate1=$scope.probDate1;
								 $scope.book.probDate2=$scope.probDate2;
								 $scope.book.status="created";
								 
								 //console.log($scope.book);
								 
								 Book.create($scope.book, 
											 function(value){
									 			var message = '<strong>¡Listo!</strong> Has hecho una reservación.';
				  								var id = Flash.create('success', message);
									 
									 			$location.path("/mysales");
								 			 }, 
											 function(error)
											 {
									 			var message = '<strong>¡Error!</strong> No se ha podido generar la reservación.';
				  								var id = Flash.create('danger', message);
											 });
								 
								 	ngDialog.close();
									 
								 };
								 
								  
							  }],
						resolve : {
							 currentUser : ["Person" ,function(Person){
									return Person.getCurrent(); 	
								}]
						}
					   });
      }
	  

	   
	  
	  
  }
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

})();
