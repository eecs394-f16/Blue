angular
  .module('rental')
  .controller('LoginController', function($scope, supersonic, $http) {
    $scope.hideMe = true;
    if(localStorage.getItem('user') === null){
      $scope.hideMe = false;
    }
    $scope.fbusername= "";
    $scope.logme = function(){
      
      if(localStorage.getItem('user') === null){
        
        if($scope.fbusername.length > 0){
          $http({
                        method : "GET",
                        url : "http://naybro-node.mybluemix.net/user",
                        params : {
                            username : $scope.fbusername
                        }})
                    .then(function(response) {
                        if(response.data.length){
                          $scope.uid = response.data[0].Uid;
                          localStorage.setItem('user', $scope.uid );
                          $scope.logme();
                        }
                        else{
                          $http({
                            method : "GET",
                            url : "http://naybro-node.mybluemix.net/signup",
                            params : {
                              username : $scope.fbusername
                            }});
                            $scope.logme();

                        }
                      });
        }
      }
      else{
        supersonic.ui.initialView.dismiss();
      }
    };
  });