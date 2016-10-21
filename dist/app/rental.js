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

    var _refreshListing = function () {
        
        $http({
            method : "GET",
            url : "http://naybro-node.mybluemix.net/details",
            params: {
                pid : $scope.productId
            }})
        .then(function(response) {
                
            $scope.searchResults = response.data[0];
            $scope.productName = $scope.searchResults.Name;
            $scope.productRate = $scope.searchResults.Rate;
            $scope.productDescription = $scope.searchResults.Description;
            $scope.img = $scope.searchResults.Img;
            $http({
                method : "GET",
                url : "http://naybro-node.mybluemix.net/user",
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
                  uid: 4
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
        
        $http({
            method: 'GET',
            url: 'http://naybro-node.mybluemix.net/request',
            headers: { 'Content-Type': 'application/json' } ,
            params : {
                uid1: $scope.searchResults.Uid,
                pid: $scope.productId,
                uid2: 4,
                hours: 6
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

    $scope.navbarTitle = "Login";
    $scope.logme = "I'm waiting!!";
    //steroids.addon.facebook.ready.then(funtion(){
     //$scope.logme = "Done";
    console.log("Lolo not gonig to werk");
      // });


  });

angular
  .module('rental')
  .controller('SearchController', function($scope, supersonic, $http) {

    $scope.navbarTitle = "Search";
    $scope.searchResult = undefined;
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
  .controller('myAccountController', function ($scope) {
      $scope.loadProfile = function () {
          $scope.account = { 'name': 'Brian Walker', 'location': 'Evanston, IL', 'email': 'brian@nu.com', 'number': '(123) 567-789', 'description': 'I have many things to rent out' };
      };
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
                uid: 4
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
                $scope.date = new Date($scope.rentalsResults[i].initialTime);
                $scope.rentalsResults[i].initialTime = $scope.date.toLocaleString();
                switch ($scope.rentalsResults[i].status) {
                    case 'requested':
                        $scope.rentalsResults[i].statusBefore = '';
                        $scope.rentalsResults[i].statusClass = 'orange';
                        $scope.rentalsResults[i].statusAfter = '/confirmed/in use/returned/rated';
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
           
    supersonic.ui.views.current.whenVisible( function () {
      
      $scope.loadRentals();
    });
  });

angular
  .module('rental')
  .controller('newListingController', function($scope, supersonic, $http) {
   
   $scope.listing = undefined;
   $scope.update = function(listing) {
      
      supersonic.logger.debug(listing);
   };
 
    supersonic.ui.views.current.whenVisible( function () {
          $http({
          method : "GET",
          url : "http://naybro-node.mybluemix.net/user",
          params : {
              uid : 4
          }}).then(function(response) {
          
             $scope.username = response.data[0].Username;
          });
      });
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
    
});