angular
  .module('rental')
  .controller('DetailController', function($scope) {

    $scope.username= localStorage.getItem('user');
    $scope.productRate=localStorage.getItem('productRate');
    $scope.productRating=localStorage.getItem('productRating');
    $scope.productName=localStorage.getItem('productName');
    $scope.productDescription=localStorage.getItem('productDescription');

    $scope.rentItem = function() {
        
        var options = {
            message: "Confirm to rent item ?",
            buttonLabels: ["Yes", "No"]
            };
            
            supersonic.ui.dialog.confirm("", options).then(function(index) {
                if (index === 0) {
                    var view = new supersonic.ui.View("rental#inbox");
                    supersonic.ui.layers.push(view);
                    } else {
                        supersonic.logger.log("no rent");
                        }
                        });
            };
  });
