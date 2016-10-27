angular
  .module('rental')
  .controller('SearchController', function($scope, supersonic, $http) {

    $scope.navbarTitle = "Search";
    $scope.searchResult = undefined;
    document.activeElement.blur(); 
     $http({
      method : "GET",
      url : "http://naybro-node.mybluemix.net/init",
      params: {
      productName : $scope.searchInput
      }})
    .then(function(response) {
      $scope.searchResults = response.data;
    });
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
