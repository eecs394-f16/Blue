angular
  .module('rental',  ["ionic", "ngCordova"])
  .controller('LoginController', ["$scope", "$cordovaOauth", "$http", function($scope, supersonic, $cordovaOauth, $http) {
    
    window.cordovaOauth = $cordovaOauth;
    window.http = $http;
    
    $scope.changeView = function () {

       var view = new supersonic.ui.View("rental#newListing");
        supersonic.ui.layers.push(view);
    };
    
    $scope.navbarTitle = "Login";
    $scope.logme = "I'm waiting!!";
    //steroids.addon.facebook.ready.then(funtion(){
     //$scope.logme = "Done";
    console.log("Lolo not gonig to werk");
      // });


  }]);
