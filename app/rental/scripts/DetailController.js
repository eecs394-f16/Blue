angular
  .module('rental')
  .controller('DetailController', function($scope, supersonic) {

    //$scope.username= localStorage.getItem('user');
    //$scope.productRate=localStorage.getItem('productRate');
    //$scope.productRating=localStorage.getItem('productRating');
    //$scope.productName=localStorage.getItem('productName');
    //$scope.productDescription=localStorage.getItem('productDescription');

    $scope.productId = undefined;

    var _refreshListing = function () {

       supersonic.data.model('Product').findAll({query: JSON.stringify({"Pid": parseInt($scope.productId)})}).then(function(Products) {
        
        $scope.$apply( function () {
            
            supersonic.data.model('Users').findAll({query: JSON.stringify({"Uid": Products[0].Uid})}).then(function(Users) {

            $scope.username = Users[0].Username;
            });
            $scope.productName = Products[0].Name;
            $scope.productRate = Products[0].Rate;
            $scope.productDescription = Products[0].Description;
            });
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
    
    $scope.rentItem = function() {
        
        var options = {
            message: "Confirm to rent item ?",
            buttonLabels: ["Yes", "No"]
            };
            
            supersonic.ui.dialog.confirm("", options).then(function(index) {
                if (index === 0) {
                     var sendRequest = function (Pid, Uid) {
                      	var newRequestKey = firebase.database().ref('request').push().key;
                      	firebase.database().ref('request/' + newRequestKey).update({
                        		renter: 'user1'
                      	});
                    };
                  sendRequest(1234, 4321);
                    var view = new supersonic.ui.View("rental#inbox");
                    supersonic.ui.layers.push(view);
                 } else {
                        supersonic.logger.log("no rent");
                        }
                        });
            };
  });
