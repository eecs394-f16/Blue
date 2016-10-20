angular
  .module('rental')
  .controller('newListingController', function($scope, supersonic, $http) {
   
   $scope.listing = undefined;
   $scope.update = function(listing) {
      
      supersonic.logger.debug(listing);
   };
 
    supersonic.ui.views.current.whenVisible( function () {
          $http({
          method : "GET",
          url : "http://naybro-node.mybluemix.net/user",
          params : {
              uid : 4
          }}).then(function(response) {
          
             $scope.username = response.data[0].Username;
          });
      });
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
    
});