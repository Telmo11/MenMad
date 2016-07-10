(function(){
  'use strict';

  angular.module('mentory')
    .controller('profileCtrl',profileCtrl);

	profileCtrl.$inject=['currentProfile','Person','Mentory','Upload','$sce','$timeout','$route','alertify','$anchorScroll', '$location', '$scope','Book'];
	
	//Dashboard for /profile/id
	function profileCtrl(currentProfile,Person,Mentory,Upload,$sce,$timeout,$route,alertify,$anchorScroll,$location,$scope,Book){

		var profile = this;
		profile.skip=2;
		profile.minDate = new Date();
		
		
		currentProfile.$promise.then(function(response){
			console.log("User desde profile : ",response);	
			profile.user = response;
			
			
            //Fetch the actual loggedIn User
            Person.getCurrent(
				function(data){
                              
					profile.actualUser = data;
					profile.validate = profile.user.iduser == profile.actualUser.iduser;
					console.log("validate:"+profile.validate);
				},
				function(error){
					alertify.delay(3000).error("¡Lo sentimos, no hemos podido obtener el usuario!");				
            });
            
            var canvas = document.getElementById('myCanvas');
			var context = canvas.getContext('2d');
			var imageObj = new Image();

			imageObj.onload = function() {
			context.drawImage(imageObj, 0, 0);
			};
			imageObj.src = profile.user.imgfront;
			
			//Count the number of mentories, if he has more than 2 show the Load more button
			Person.userReviews.count( { id: profile.user.iduser},
			  function(value){
					
				if(value.count <= 2)
				{
					profile.showLoadMoreReviewsButton=false;
				}else{
					profile.showLoadMoreReviewsButton=true;
				}
					
			3
			  },
			  function(error){
				alertify.delay(3000).error("¡Error al obtener reviews!");				
			  });
			
			
		});//currentProfile promise
		
		
	Person.find({
  		filter: { limit: 6 }
		}, function(data) { 
			console.log(data);
			profile.users = data;
		}, function(error){

		});
		
		profile.goToReservation = function(){
			
            profile.indexTab = 1;
            var newHash = 'content-tabs';
            var old = $location.hash();

            
            if ($location.hash() !== newHash) 
            {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(newHash);
                $anchorScroll();
                $location.hash(old);
            } 
            
            else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
            //$location.hash('tabs');
            
            

		}
        
        profile.goToAnchor = function(){
            
            var newHash = 'content-tabs';
            var old = $location.hash();
            
            if ($location.hash() !== newHash) 
            {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(newHash);
                $anchorScroll();
                $location.hash(old);
            } 
            
            else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
            
        }

		
		profile.reservation= function(){
			
			if(profile.book.estimatedTime && profile.book.reason && profile.book.probDate1 && profile.book.probDate2 ){
				Person.getCurrent(
					function(data){

						profile.book.status="created";
						profile.book.created=new Date();
						profile.book.iduser=data.iduser;
						profile.book.cost = profile.user.cost;
						profile.book.iduserbooked = profile.user.iduser;
						console.log(profile.book);

						Book.create(profile.book, 
								 function(value){
									alertify.delay(3000).success("Listo! Hemos enviado tu reservación con este mentor");
									$location.path("/dashboard");
								 }, 
								 function(error)
								 {
									alertify.delay(3000).error("Lo sentimos, No se ha podido hacer la reservación");
								 });
					},
					function(error){

					});	
			}
			
		
		}
			
			//console.log("Inicio de Reservación");
        	/*ngDialog.open({ template: 'templateReservation', appendTo: ".boxes" , width: '60%', className: 'ngdialog-theme-default', 
						controller: ['$scope','currentUser','Book', function($scope,currentUser,Book) {
							// controller logic
							
							$scope.book={};
								
							currentUser.$promise.then(function(response){
									//console.log(response);	
									 $scope.book.iduser=response.iduser;
							
								});
								 
							 $scope.book.iduserbooked=profile.user.iduser;
							
							 $scope.reserveMentory = function(){
								 
								 
								 
								 
								 	ngDialog.close();
									 
								 };
								 
								  
							  }],
						resolve : {
							 currentUser : ["Person" ,function(Person){
									return Person.getCurrent(); 	
								}]
						}
					   });
    
		}//openDialog*/
		
	

		/*dashboard.loadMentories = function(){
			
			//Fetch the user mentories with their own categories
			Person.mentories( { id: profile.user.iduser ,  
					filter: 	{ limit: dashboard.skip , include : 'categories'} 
				 
							  },
			  function(value){
				
				
				dashboard.user.mentories=value;	
				
			
			  },
			  function(error){
				var message = '<strong>Error!</strong> ' + error;
				var id = Flash.create('danger', message);	
			  });
				
			dashboard.skip+=2;
			
				
		}
		*/
        
        
         function getDataUri(url, callback) {
            var image = new Image();

            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
                
                canvas.getContext('2d').drawImage(this, 0, 0);

                // Get raw image data
                //callback(canvas.toDataURL('image/jpg').replace(/^data:image\/(png|jpg);base64,/, ''));
                //console.log(canvas.width+"-"+canvas.height);
                if(canvas.width<800||canvas.height<250)
                {
                    alertify.delay(3000).error("¡Las dimensiones mínimas de la imagen deben ser 800 x 200 !");
                    return;
                }
                // ... or get as Data URI
                callback(canvas.toDataURL('image/jpg'));
            };

            image.src = url;
        }

        

	
		//Upload your photo
		profile.upload = function (data, name) {
					
            var dataUrl = URL.createObjectURL(data);
                    
			
            getDataUri(dataUrl, function(dataUri) {
                profile.imageUri = dataUri;
                // Do whatever you'd like with the Data URI!
                var file=Upload.dataUrltoBlob(profile.imageUri, name);
                profile.user.imgfront="https://s3-us-west-2.amazonaws.com/mentorybucket/frontimages/"+profile.user.iduser+"/front-image.jpg";
                profile.user.lastUpdated=new Date();
                profile.user.$save();
                
                profile.policy = "ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogIm1lbnRvcnlidWNrZXQifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICIiXSwKICAgIHsiYWNsIjogInByaXZhdGUifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9";
		
				profile.signature="OvId9s3FjPZjUrFqtqOgafIAhh4=";

                Upload.upload({
                    url: 'https://s3-us-west-2.amazonaws.com/mentorybucket/',
                    method: 'POST',
                    data: {


                        key: 'frontimages/'+profile.user.iduser+'/front-image.jpg',
                        AWSAccessKeyId:"AKIAJIBWAOYJATAZSWVA" ,
                        acl: 'private', // sets the access to the uploaded file in the bucket: private, public-read, ...
                        policy: profile.policy, // base64-encoded json policy (see article below)
                        signature: profile.signature, // base64-encoded signature based on policy string (see article below)
                        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                        file: file,
                        filename: file.name, // this is needed for Flash polyfill IE8-9


                    },
                }).then(function (response) {
                    $timeout(function () {
                        profile.result = response.data;
                        console.log(profile.result);
                        $route.reload();

                    });
                }, function (response) {
                    if (response.status > 0) profile.errorMsg = response.status 
                        + ': ' + response.data;
                }, function (evt) {
                    profile.progress = parseInt(100.0 * evt.loaded / evt.total);
                });//Upload.upload
				
            });
            
            
    	}//profile.upload

	
	}//profileCtrl
	
	

	

})();