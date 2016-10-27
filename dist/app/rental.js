angular.module('users', [
  /* Declare any module-specific dependencies here */
  'common'
]);
angular
.module('rental', [
  // Declare any module-specific AngularJS dependencies here
  'supersonic'
]);

angular
  .module('rental')
  .controller('DetailController', function($scope, supersonic, $http) {

      $scope.productId = undefined;
      document.getElementById("datePicker").value = "2016-10-27";
      $scope.range = function (n) {
          return new Array(n);
      };

    var _refreshListing = function () {
        
        $http({
            method : "GET",
            url : "http://naybro-node.mybluemix.net/details",
            params: {
                pid : $scope.productId
            }})
        .then(function (response) {
            $scope.searchResults = response.data[0];
            $scope.productName = $scope.searchResults.Name;
            $scope.productRate = $scope.searchResults.Rate;
            $scope.productDescription = $scope.searchResults.Description;
            $scope.productRating = parseInt($scope.searchResults.Rating);
            $scope.img = $scope.searchResults.Img;
            $http({
                method : "GET",
                url : "http://naybro-node.mybluemix.net/uid",
                params : {
                    uid : $scope.searchResults.Uid
                }})
            .then(function(response) {
                
                $scope.username = response.data[0].Username;
                });
            });
       };
      $scope.loadRentals = function () {
          $http({
              method: "GET",
              url: "http://naybro-node.mybluemix.net/rentals",
              params: {
                  uid: parseInt(localStorage.getItem('user'))
              }
          }).then(function (response) {
              $scope.rentalsResults = response.data;
              for (var i = 0; i < $scope.rentalsResults.length; i++) {
                  $http({
                      method: "GET",
                      url: "http://naybro-node.mybluemix.net/details",
                      params: {
                          pid: $scope.rentalsResults[i].Pid
                      }
                  }).then(function (responseP) {
                      name = responseP.data[0].Name;
                      img = responseP.data[0].Img;
                      for (var j = 0; j < $scope.rentalsResults.length; j++) {
                          if ($scope.rentalsResults[j].Pid == responseP.data[0].Pid) {
                              $scope.rentalsResults[j].img = img;
                              $scope.rentalsResults[j].name = name;
                          }
                      }
                  });
              }
          });
      };
    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.productId ) {
        _refreshListing();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.productId = values.id;
      _refreshListing();
    });
    
    $scope.postRental = function() {
        //var date = document.getElementById('datePicker').value;
        $http({
            method: 'GET',
            url: 'http://naybro-node.mybluemix.net/request',
            headers: { 'Content-Type': 'application/json' } ,
            params : {
                uid1: parseInt(localStorage.getItem('user')),
                pid: $scope.productId,
                uid2: $scope.searchResults.Uid,
                hours: 6
                //date: date
                }
            }).then(function(response) {
                    supersonic.logger.debug(response);
                },
                function (response) {
                    supersonic.logger.debug(response);
                });
    };
    
    supersonic.data.channel('changeTab').subscribe( function(index) {
        
        supersonic.ui.tabs.select(index);
    });
    $scope.rentItem = function() {

        var options = {
            message: "Confirm to rent item ?",
            buttonLabels: ["Yes", "No"]
            };
            
            supersonic.ui.dialog.confirm("", options).then(function(index) {
                if (index === 0) {
                    var options = {
                        message: "Your request has been sent!",
                        buttonLabel: "Close"
                    };
                    supersonic.ui.dialog.alert("Congratulations", options).then(function () {
                        supersonic.logger.log("Alert closed");
                    });
                    $scope.postRental();
                    supersonic.data.channel('rentalPost').publish("refresh");
                 } else {
                        supersonic.logger.log("no rent");
                        }
                });
            };
  });

angular
  .module('rental')
  .controller('InitialController', function($scope, supersonic) {
    
    $scope.username="initialise";
    supersonic.bind($scope, "username");
    $scope.getDetails = function() {
    
        supersonic.data.model('Product').findAll({query: JSON.stringify({"Pid": 1})}).then(function(Products) {

            supersonic.data.model('Users').findAll({query: JSON.stringify({"Uid": Products[0].Uid})}).then(function(Users) {

            localStorage.setItem('user', Users[0].Username);
            });
            localStorage.setItem('productName', Products[0].Name);
            localStorage.setItem('productRate', Products[0].Rate);
            localStorage.setItem('productDescription', Products[0].Description);
            localStorage.setItem('productRating', Products[0].Rating);
            });
        };
  });
angular
  .module('rental')
  .controller('LoginController', function($scope, supersonic, $http) {
    $scope.hideMe = true;
    if(localStorage.getItem('user') === null){
      $scope.hideMe = false;
    }
    $scope.fbusername= "";
    $scope.logme = function(){
      supersonic.logger.debug(localStorage.getItem('user'));
      if(localStorage.getItem('user') === null){
        
        if($scope.fbusername.length > 0){
          $http({
                        method : "GET",
                        url : "http://naybro-node.mybluemix.net/user",
                        params : {
                            username : $scope.fbusername
                        }})
                    .then(function(response) {
                        if(response.data.length){
                          $scope.uid = response.data[0].Uid;
                          localStorage.setItem('user', $scope.uid );
                          $scope.logme();
                        }
                        else{
                          $http({
                            method : "GET",
                            url : "http://naybro-node.mybluemix.net/signup",
                            params : {
                              username : $scope.fbusername
                            }});
                            $scope.logme();

                        }
                      });
        }
      }
      else{
        supersonic.ui.initialView.dismiss();
      }
    };
  });
angular
  .module('rental')
  .controller('SearchController', function($scope, supersonic, $http) {

    $scope.navbarTitle = "Search";
    $scope.searchResult = undefined;
    document.activeElement.blur(); 
     $http({
      method : "GET",
      url : "http://naybro-node.mybluemix.net/init",
      params: {
      productName : $scope.searchInput
      }})
    .then(function(response) {
      $scope.searchResults = response.data;
    });
    $scope.getInput = function() {

        document.activeElement.blur();
         $http({
          method : "GET",
          url : "http://naybro-node.mybluemix.net/name",
          params: {
          productName : $scope.searchInput
          }})
        .then(function(response) {

          $scope.searchResults = response.data;
        });

    };
  });

angular
  .module('rental')
  .controller('myAccountController', function ($scope,$http,supersonic) {
    newListingBtn = new supersonic.ui.NavigationBarButton({
      onTap: function() {
      localStorage.removeItem('user');
      supersonic.ui.initialView.show();
      },
      styleId: "nav-logout"
    });


      $scope.loadProfile = function () {

          $http({
                method : "GET",
                url : "http://naybro-node.mybluemix.net/uid",
                params : {
                    uid : parseInt(localStorage.getItem('user'))
            }})
            .then(function(response) {
              supersonic.ui.navigationBar.update({
                title: "Account",
                overrideBackButton: false,
                buttons: {
                  right: [newListingBtn]
                }
              }).then(supersonic.ui.navigationBar.show());
                supersonic.logger.debug(response);
                $scope.username = response.data[0].Username;
            });
          $scope.account = { 'name': $scope.username, 'location': 'Evanston, IL', 'email': 'iwanttorent@nu.com', 'number': '(123) 567-789', 'description': 'I have many things to rent out' };
      };

      supersonic.ui.views.current.whenVisible( function () {
        $scope.loadProfile();
    });

      $scope.myThings = [
          {
              'Name': 'Skateboard',
              'Img': 'http://www.bonkersenergy.com/wp-content/uploads/2015/07/skateboard_01.jpg',
              'Rate': 5,
              'Rating': 5
          }
      ];

      supersonic.data.channel('pseudoNewListing').subscribe(function(html){


        document.getElementById("cheat").innerHTML = document.getElementById("cheat").innerHTML + html;
        supersonic.ui.tabs.select(2);
        supersonic.data.channel('pseudoDone').publish();
      });
  });

angular
  .module('rental')
  .controller('myRentalsController', function ($scope, supersonic, $http) {
    
    newListingBtn = new supersonic.ui.NavigationBarButton({
      onTap: function() {
        
        var view = new supersonic.ui.View("rental#newListing");
        supersonic.ui.layers.push(view);
      },
      styleId: "nav-newListing"
    });
    
    supersonic.ui.navigationBar.update({
      title: "My Rentals",
      overrideBackButton: false,
      buttons: {
        right: [newListingBtn]
      }
    }).then(supersonic.ui.navigationBar.show());
    
    supersonic.data.channel('rentalPost').subscribe( function() {
    
        $scope.loadRentals();
        supersonic.data.channel('changeTab').publish(1);
    });
    
    $scope.rentalsResults = [];

    $scope.loadRentals = function () {
        $http({
            method: "GET",
            url: "http://naybro-node.mybluemix.net/rentals",
            params: {
                uid: parseInt(localStorage.getItem('user'))
            }
        }).then(function (response) {
            $scope.rentalsResults = response.data;
            for (var i = 0; i < $scope.rentalsResults.length; i++) {
                $http({
                    method: "GET",
                    url: "http://naybro-node.mybluemix.net/details",
                    params: {
                        pid: $scope.rentalsResults[i].Pid
                    }
                }).then(function (responseP) {
                    name = responseP.data[0].Name;
                    img = responseP.data[0].Img;
                    for (var j = 0; j < $scope.rentalsResults.length; j++) {
                        if ($scope.rentalsResults[j].Pid == responseP.data[0].Pid) {
                            $scope.rentalsResults[j].img = img;
                            $scope.rentalsResults[j].name = name;
                        }
                    }
                });
                if ($scope.rentalsResults[i].Uid1 != parseInt(localStorage.getItem('user')))
                    $scope.rentalsResults[i].role = 'renter';
                else
                    $scope.rentalsResults[i].role = 'rentee';
                $scope.date = new Date($scope.rentalsResults[i].initialTime);
                $scope.rentalsResults[i].initialTime = $scope.date.toLocaleString();
                $scope.rentalsResults[i].action = "hidden"
                switch ($scope.rentalsResults[i].status) {
                    case 'requested':
                        $scope.rentalsResults[i].statusBefore = '';
                        $scope.rentalsResults[i].statusClass = 'orange';
                        $scope.rentalsResults[i].statusAfter = '/confirmed/in use/returned/rated';
                        if ($scope.rentalsResults[i].role == 'rentee')
                            $scope.rentalsResults[i].action = 'visible';
                        break;
                    case 'confirm': case 'confirmed':
                        $scope.rentalsResults[i].statusBefore = 'requested/';
                        $scope.rentalsResults[i].statusClass = 'yellow';
                        $scope.rentalsResults[i].statusAfter = '/in use/returned/rated';
                        break;
                    case 'in use':
                        $scope.rentalsResults[i].statusBefore = 'requested/confirmed';
                        $scope.rentalsResults[i].statusClass = 'green';
                        $scope.rentalsResults[i].statusAfter = '/returned/rated';
                        break;
                    case 'returned':
                        $scope.rentalsResults[i].statusBefore = 'requested/confirmed/in use/';
                        $scope.rentalsResults[i].statusClass = 'blue';
                        $scope.rentalsResults[i].statusAfter = '/rated';
                        break;
                    case 'rated':
                        $scope.rentalsResults[i].statusBefore = 'requested/confirmed/in use/returned/';
                        $scope.rentalsResults[i].statusClass = 'purple';
                        $scope.rentalsResults[i].statusAfter = '';
                        break;
                }
            }
        });
    };

    $scope.acceptRentals = function(Rid) {
      
     $http({
            method: "GET",
            url: "http://naybro-node.mybluemix.net/rentals/accept",
            params: {
                rid: Rid
            }});
    };
    
    $scope.rejectRentals = function(Rid) {
      
     $http({
            method: "GET",
            url: "http://naybro-node.mybluemix.net/rentals/reject",
            params: {
                rid: Rid
            }});
    };
    
    $scope.acceptRequest = function (Rid) {
        var options = {
            message: "Are you sure you want to accept this request?",
            buttonLabels: ["Yes", "No"]
        };
        supersonic.ui.dialog.confirm("Accept", options).then(function (index) {
            if (index == 0) {
                $scope.acceptRentals(Rid);
                alert('ok you have accepted the request');
                $scope.loadRentals();
            }
            else
                alert('ok you have not accepted the request');
        });
    }

    $scope.rejectRequest = function (Rid) {
        var options = {
            message: "Are you sure you want to reject this request?",
            buttonLabels: ["Yes", "No"]
        };
        supersonic.ui.dialog.confirm("Reject", options).then(function (index) {
            if (index == 0) {
                $scope.rejectRentals();
                alert('ok you have rejected the request');
                $scope.loadRentals();
            }
            else
                alert('ok you have not rejected the request');
        });
    }
           
    supersonic.ui.views.current.whenVisible( function () {
      $scope.loadRentals();
    });
  });

angular
  .module('rental')
  .controller('newListingController', function($scope, supersonic, $http) {
   
   $scope.img = undefined;
   $scope.listing = undefined;
   $scope.update = function(listing) {
      
      supersonic.logger.debug(listing);
      var image = document.getElementById('listingImg');
      
      var html= "<a class='item'> <img style='display: inline-block' class='img-mini' id='details-img' src='"+image.src+"' /> <table class='details detailsTable' style='display:inline-block'> <tr> <td><i class='icon super-pricetag'></i></td> <td>"+listing.name+"</td> </tr><tr><td><i class='icon super-social-usd'></i></td><td>"+listing.rate+"/hr</td></tr><tr><td><i class='icon super-star'></i></td><td>Rating : 0</td> </tr> </table> </a>";
                  
       supersonic.data.channel('pseudoNewListing').publish(html);
       supersonic.data.channel('pseudoDone').subscribe(function(){
         supersonic.ui.layers.pop();
       });  
   };
 
    supersonic.ui.views.current.whenVisible( function () {
          $http({
          method : "GET",
          url : "http://naybro-node.mybluemix.net/uid",
          params : {
              uid : localStorage.getItem('user')
          }}).then(function(response) {
          
             $scope.username = response.data[0].Username;
          });
      });
    
    $scope.updateImg = function() {
      
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
         destinationType: Camera.DestinationType.DATA_URL
      });
    };
   
   function onSuccess(imageData) {
      var image = document.getElementById('listingImg');
      image.src = "data:image/jpeg;base64," + imageData;
  }

   function onFail(message) {}
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
    
});