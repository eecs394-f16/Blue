angular
  .module('rental')
  .controller('myAccountController', function ($scope,$http,supersonic) {
    newListingBtn = new supersonic.ui.NavigationBarButton({
      onTap: function() {
      localStorage.removeItem('user');
      supersonic.ui.initialView.show();
      },
      styleId: "nav-logout"
    });


      $scope.loadProfile = function () {

          $http({
                method : "GET",
                url : "http://naybro-node.mybluemix.net/uid",
                params : {
                    uid : parseInt(localStorage.getItem('user'))
            }})
            .then(function(response) {
              supersonic.ui.navigationBar.update({
                title: "Account",
                overrideBackButton: false,
                buttons: {
                  right: [newListingBtn]
                }
              }).then(supersonic.ui.navigationBar.show());
                supersonic.logger.debug(response);
                $scope.username = response.data[0].Username;
            });
          $scope.account = { 'name': $scope.username, 'location': 'Evanston, IL', 'email': 'iwanttorent@nu.com', 'number': '(123) 567-789', 'description': 'I have many things to rent out' };
      };

      supersonic.ui.views.current.whenVisible( function () {
        $scope.loadProfile();
    });

      $scope.myThings = [
          {
              'Name': 'Skateboard',
              'Img': 'http://www.bonkersenergy.com/wp-content/uploads/2015/07/skateboard_01.jpg',
              'Rate': 5,
              'Rating': 5
          }
      ];

      supersonic.data.channel('pseudoNewListing').subscribe(function(html){


        document.getElementById("cheat").innerHTML = document.getElementById("cheat").innerHTML + html;
        supersonic.ui.tabs.select(2);
        supersonic.data.channel('pseudoDone').publish();
      });
  });
