(function(){
	'use strict';

	var settingsComponent = {
		templateUrl : '/app/components/settingscomponent/settings.html',
		controller : editCtrl
	};

	angular
		.module('mentory')
		.component('settingsComponent',settingsComponent);
	
	//Controller for <settings-component>
	function editCtrl(Person,Category,$window,$location,tagsService,Upload,$timeout,$route,alertify){
		var edit=this;
		edit.categoriesTags= [];
	
			  
		//Get the current user and fetch his categories.
		Person.getCurrent(function(response){
			
			edit.user = response;
			Person.categories({id:edit.user.iduser}, 
							  function(data){
								for(var i=0; i<data.length ; i++)
								{
									//onsole.log(data[i]);	
									edit.categoriesTags[i]={text : data[i].name};
								}					
							},
							  function(err){
								console.log(err);
							});
			
		},function(error){
			
		});
		
		
		//Upload your photo
		edit.upload = function (dataUrl, name) {
			
		var file=Upload.dataUrltoBlob(dataUrl, name);
			
		edit.user.profileimage="https://s3-us-west-2.amazonaws.com/mentorybucket/profileimages/"+edit.user.iduser+"/profile.jpg";
		edit.user.lastUpdated=new Date();
		edit.user.$save();
			
        Upload.upload({
            url: 'https://s3-us-west-2.amazonaws.com/mentorybucket/',
			method: 'POST',
            data: {
				
               
				key: 'profileimages/'+edit.user.iduser+'/profile.jpg',
				AWSAccessKeyId:"AKIAJIBWAOYJATAZSWVA" ,
				acl: 'private', // sets the access to the uploaded file in the bucket: private, public-read, ...
				policy: edit.policy, // base64-encoded json policy (see article below)
				signature: edit.signature, // base64-encoded signature based on policy string (see article below)
				"Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
				file: file,
				filename: file.name, // this is needed for Flash polyfill IE8-9
			
				
            },
        }).then(function (response) {
            $timeout(function () {
                
				console.log(edit.result);
				
				alertify.delay(3000).success("Se ha actualizado tu foto de perfil");
				$timeout(function () {
					window.location.reload();
					
				}, 2000);
				
				
            });
        }, function (response) {
            if (response.status > 0) edit.errorMsg = response.status 
                + ': ' + response.data;
        }, function (evt) {
            edit.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
		
		//Upload your photo company
		edit.uploadImgCompany = function (dataUrl, name) {
			
		var file=Upload.dataUrltoBlob(dataUrl, name);
			
		edit.user.imgcompany="https://s3-us-west-2.amazonaws.com/mentorybucket/companyimages/"+edit.user.iduser+"/company.jpg";
		edit.user.lastUpdated=new Date();
		edit.user.$save();
			
        Upload.upload({
            url: 'https://s3-us-west-2.amazonaws.com/mentorybucket/',
			method: 'POST',
            data: {
				
               
				key: 'companyimages/'+edit.user.iduser+'/company.jpg',
				AWSAccessKeyId:"AKIAJIBWAOYJATAZSWVA" ,
				acl: 'private', // sets the access to the uploaded file in the bucket: private, public-read, ...
				policy: edit.policy, // base64-encoded json policy (see article below)
				signature: edit.signature, // base64-encoded signature based on policy string (see article below)
				"Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
				file: file,
				filename: file.name, // this is needed for Flash polyfill IE8-9
			
				
            },
        }).then(function (response) {
            $timeout(function () {
                
				alertify.delay(3000).success("Se ha actualizado tu foto de compañia");
				$timeout(function () {
					window.location.reload();
					
				}, 2000);
            });
        }, function (response) {
            if (response.status > 0) edit.errorMsg = response.status 
                + ': ' + response.data;
        }, function (evt) {
            edit.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
    }
		
		
		
		
		edit.policy = "ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogIm1lbnRvcnlidWNrZXQifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICIiXSwKICAgIHsiYWNsIjogInByaXZhdGUifSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9";
		
		edit.signature="OvId9s3FjPZjUrFqtqOgafIAhh4=";
		
		
		
		//Asynchronusly call the items for the expertise tags input from the tagsService
		edit.loadItems= function(query)
		{
				
				return tagsService.load(query);

		}

			
		//Updating the user profile		
		edit.update = function(){
	
			
			edit.user.$save();
			edit.user.lastUpdated=new Date();
			alertify.delay(3000).success("¡Has actualizado tu perfil !");
			//window.location.reload();	
			
			//edit.user.$save();
		}
		
		edit.addCategory = function(tag){
			
				tag.text=tag.text.replace(/-/g, " ");
				//Find the first instance of the selected category and then link to the current user
				Category.find({filter: { where : { name : tag.text }}},
										function(value){
											
											
											var fk_category=value[0].idcategory;
											//console.log("fk : ",fk_category);
											//console.log("iduser : ",edit.user.iduser);
											Person.categories.link({id:edit.user.iduser, fk:fk_category},null).$promise.then(
												function(sucess){
												  console.log(sucess);
												  Person.categories( {id: edit.user.iduser},   
														  function(value){
															edit.user.categories=value;	
													  		alertify.delay(3000).success("¡Se han actualizado tus categorias!");	

														  },
														  function(error){
													  		alertify.delay(3000).error("¡Error al actualizar tus categorias !");
														  });
												},
												function(error){
													console.log(error);
													//-- 404 error retuned
													alertify.delay(3000).error("¡Error al actualizar tus categorias !");	
												 }
											 );
					
										},
										function(error){
											alertify.delay(3000).error("¡Error al actualizar tus categorias !");	
										});
				
				
				
				
				//Person.categories.link({id: edit.user.iduser, fk: fk_category})
				
				
				
			
			
		}
		
		edit.deleteCategory= function(tag) {
			
			tag.text=tag.text.replace(/-/g, " ");
			Category.findOne({ 
			  filter: { where: { name: tag.text} }
			},
		  	function(data){
				
				
				//Destroy the link between user and the selected category
				Person.categories.unlink({id:edit.user.iduser, fk:data.idcategory},null).$promise.then(
				function(sucess){
				  console.log(sucess);
				  
				 alertify.delay(3000).success("¡Se ha borrado tu categoria !");
				
				},
				function(error){
					console.log(error);
					alertify.delay(3000).error("¡Error al actualizar tus categorias !");
				 }
			 );
				
			},
				
			  function(error){
				console.log(error);
				alertify.delay(3000).error("¡Error al actualizar tus categorias !");
			
			
			});
		}
		
		edit.deleteUser = function()
		{
			
			 Person.logout(
					function(value,responseHeaders){
						
						$rootScope.$broadcast(authEvents.LOGOUT_SUCCESS);
						$rootScope.currentUser=null;
						localStorage.clear();	
				},
					function(error){
						console.log(error);
				});
			
			
			Person.deleteById({ id: edit.user.iduser })
			  .$promise
			  .then(function() { 
									console.log('deleted');
									alertify.delay(3000).success("¡Esperamos verte pronto !");
							   });
			
			$location.path("/");
			window.location.reload;
		}
		
		
	  
	}
		
	
	
})();