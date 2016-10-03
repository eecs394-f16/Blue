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
