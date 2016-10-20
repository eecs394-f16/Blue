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
