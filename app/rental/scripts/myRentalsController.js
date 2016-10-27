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
                if ($scope.rentalsResults[i].Uid1 != 4)
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

    $scope.acceptRequest = function (Rid) {
        var options = {
            message: "Are you sure you want to accept this request?",
            buttonLabels: ["Yes", "No"]
        };
        supersonic.ui.dialog.confirm("Accept?", options).then(function (index) {
            if (index == 0) {
                $scope.loadRentals();
                alert('ok you have accepted the request');
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
        supersonic.ui.dialog.confirm("Reject?", options).then(function (index) {
            if (index == 0) {
                $scope.loadRentals();
                alert('ok you have rejected the request');
            }
            else
                alert('ok you have not rejected the request');
        });
    }
           
    supersonic.ui.views.current.whenVisible( function () {
      $scope.loadRentals();
    });
  });
