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
            
        supersonic.ui.dialog.confirm("", options).then(function (index) {
            if (index === 0) {
                function sendRequest(Pid, Uid) {
                    var newRequestKey = firebase.database().ref('request').push().key;
                    firebase.database().ref('request/' + newRequestKey).update({
                        renter: 'user1'
                    });
                }
                sendRequest(1234, 4321);
                supersonic.ui.tabs.select(2);
            } else {
                supersonic.logger.log("no rent");
            }
        });
    };
});
