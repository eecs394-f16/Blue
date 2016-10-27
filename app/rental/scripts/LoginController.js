angular
  .module('rental')
  .controller('LoginController', function($scope, supersonic, $http) {

    $scope.fbusername= "Use Facebook Username";
    $scope.logme = function(){
      if($scope.fbusername.length > 0){
        supersonic.ui.initialView.dismiss();
      }
    };

  });
