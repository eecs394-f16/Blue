angular
  .module('rental')
  .controller('LoginController', function($scope, supersonic, $http) {
<<<<<<< HEAD
    $scope.fbusername= "";
=======
    $scope.hideMe = true;
    if(localStorage.getItem('user') === null){
      $scope.hideMe = false;
    }
    $scope.fbusername= "Use Facebook Username";
>>>>>>> 977c55d203d5ccafc2d4e97a7a547555eb1bfc48
    $scope.logme = function(){      //if the box isnt empty
      if($scope.fbusername.length > 0){
        //if no userid is found in local storage
        if(localStorage.getItem('user') === null){
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
                            }})
                            $scope.logme();

                        }
                      });
        }
        else{
          supersonic.ui.initialView.dismiss();
        }


      }

    };

  });
