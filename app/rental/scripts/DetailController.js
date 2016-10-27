angular
  .module('rental')
  .controller('DetailController', function($scope, supersonic, $http) {

      $scope.productId = undefined;
      $scope.selectedDate = "2016-10-27";
      document.getElementById("datePicker").value = $scope.selectedDate;
      $scope.range = function (n) {
          return new Array(n);
      };

      $scope.changeDate = function () {
          getDates();
      }

      var getDates = function () {
          for (var i = 9; i < 24; i++) {
              document.getElementById(i).className = "unselected";
          }
          $http({
              method: "GET",
              url: "http://naybro-node.mybluemix.net/date",
              params: {
                  pid: $scope.productId,
                  date: $scope.selectedDate
              }
          }).then(function (response) {

              var currentBookings = response.data;
              for (var i = 0; i < currentBookings.length; i++) {
                  var dateObj = new Date(currentBookings[i].initialTime);
                  var start = dateObj.getHours();
                  for (var j = start; j < parseInt(start + currentBookings[i].hoursRented) ; j++) {
                      if (j > 23)
                          break;
                      document.getElementById(j).className = "locked";
                  }
              }
          });
      };

      $scope.select = function (id) {
          if (document.getElementById(id).className == 'unselected')
              document.getElementById(id).className = "selected";
          else if (document.getElementById(id).className == 'selected')
              document.getElementById(id).className = "unselected";
      }

      var _refreshListing = function () {
          getDates();
        $http({
            method : "GET",
            url : "http://naybro-node.mybluemix.net/details",
            params: {
                pid: $scope.productId
            }
        }).then(function (response) {
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
        var start = 9;
        var hours = 0;
        for (var i = 9; i < 24; i++) {
            if (document.getElementById(i).className == "selected") {
                if (hours == 0) {
                    start = i;
                }
                hours++;
            }
        }
        var date = new Date();
        date.setHours(start, 0, 0, 0);
        $http({
            method: 'GET',
            url: 'http://naybro-node.mybluemix.net/request',
            headers: { 'Content-Type': 'application/json' } ,
            params : {
                uid1: parseInt(localStorage.getItem('user')),
                pid: $scope.productId,
                uid2: $scope.searchResults.Uid,
                hours: hours,
                date: $scope.selectedDate + ' ' + date.toISOString().slice(11, 19)
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
        if (document.getElementsByClassName('selected').length == 0) {
            var options = {
                message: 'You have not selected your times.',
                buttonLabel: 'Close'
            };
            supersonic.ui.dialog.alert("Oops!", options).then(function () {
                supersonic.logger.log("Alert closed");
            });
        }
        else {

            var options = {
                message: "Confirm to rent item ?",
                buttonLabels: ["Yes", "No"]
            };

            supersonic.ui.dialog.confirm("", options).then(function (index) {
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
        }
    };
  });
