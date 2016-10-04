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
  .controller('DetailController', function($scope, supersonic) {

    $scope.productId = undefined;

    var _refreshListing = function () {

       supersonic.data.model('Product').findAll({query: JSON.stringify({"Pid": parseInt($scope.productId)})}).then(function(Products) {
        
        $scope.$apply( function () {
            
            supersonic.data.model('Users').findAll({query: JSON.stringify({"Uid": parseInt(Products[0].Uid)})}).then(function(Users) {

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
                     supersonic.ui.tabs.select(1);
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
