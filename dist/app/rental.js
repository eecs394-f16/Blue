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

            supersonic.logger.debug(Users);
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
      supersonic.logger.debug($scope.searchInput);
        document.activeElement.blur();
        $scope.searchResults =
        [
         {"id":"57e85d570640af0011000003","Rate":50,"Pid":1,"Uid":2,"Name":"Mountain Bike","Description":"Great all-purpose mountain bike for use to ride on the countryside","Rating":5,"img":"https://i.ytimg.com/vi/61aM0DXpKkc/maxresdefault.jpg"},
         {"id":"57ec44c6c95abd0011000001","Rate":5,"Pid":2,"Uid":3,"Name":"Paddle board","Description":"Wooden paddleboard rarely used","Rating":4,"img":"http://blog.lifetime.com/imagecache/Blog/paddleboard.jpg"},
         {"id":"57ec4532c95abd0013000001","Rate":1,"Pid":3,"Uid":1,"Name":"Long board","Description":"Long board with orange wheels. Two years old","Rating":3,"img":"http://www.personal.psu.edu/users/m/j/mje5180/BoarDome/Old/arbor-axis-drop-through-longboard-complete-40.jpg"},
         {"id":"57ec48f2c95abd0011000002","Rate":10,"Pid":4,"Uid":3,"Name":"Mountain Bike","Description":"Lousy mountain bike noone wants","Rating":1,"img":"http://fcdn.mtbr.com/attachments/commuting/722783d1347241301-mountain-bike-commuter-1stround018.jpg"}
         ];
        // $http({
        //  method : "GET",
        //  url : "http://naybro-node.mybluemix.net/name",
        //  params: {
        //  productName : "Mountain Bike"
        //  }})
        //.then(function(response) {
        //  supersonic.logger.debug('response');
        //  supersonic.logger.debug(response);
        //
        //});
        
    };
  });
