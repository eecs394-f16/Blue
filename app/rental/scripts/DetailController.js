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
