angular
  .module('rental')
  .controller('newListingController', function($scope, supersonic, $http) {
   
   $scope.img = undefined;
   $scope.listing = undefined;
   $scope.update = function(listing) {
      
      supersonic.logger.debug(listing);
      var image = document.getElementById('listingImg');
      
      var html= "<a class='item'> <img style='display: inline-block' class='img-mini' id='details-img' src='"+image.src+"' /> <table class='details detailsTable' style='display:inline-block'> <tr> <td><i class='icon super-pricetag'></i></td> <td>"+listing.name+"</td> </tr><tr><td><i class='icon super-social-usd'></i></td><td>"+listing.rate+"/hr</td></tr><tr><td><i class='icon super-star'></i></td><td>Rating : 0</td> </tr> </table> </a>";
                  
       supersonic.data.channel('pseudoNewListing').publish(html);
       supersonic.data.channel('pseudoDone').subscribe(function(){
         supersonic.ui.layers.pop();
       });  
   };
 
    supersonic.ui.views.current.whenVisible( function () {
          $http({
          method : "GET",
          url : "http://naybro-node.mybluemix.net/uid",
          params : {
              uid : 4
          }}).then(function(response) {
          
             $scope.username = response.data[0].Username;
          });
      });
    
    $scope.updateImg = function() {
      
      navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
         destinationType: Camera.DestinationType.DATA_URL
      });
    };
   
   function onSuccess(imageData) {
      var image = document.getElementById('listingImg');
      image.src = "data:image/jpeg;base64," + imageData;
  }

   function onFail(message) {}
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
    
});