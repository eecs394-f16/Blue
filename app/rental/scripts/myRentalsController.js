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
            }
        });
    };
           
    supersonic.ui.views.current.whenVisible( function () {
      
      $scope.loadRentals();
    });
  });
