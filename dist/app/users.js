angular.module('users', [
  /* Declare any module-specific dependencies here */
  'common'
]);
angular
  .module('users')
  .controller("EditController", function ($scope, Users, supersonic) {
    $scope.users = null;
    $scope.showSpinner = true;

    // Fetch an object based on id from the database
    Users.find(steroids.view.params.id).then( function (users) {
      $scope.$apply(function() {
        $scope.users = users;
        $scope.showSpinner = false;
      });
    });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.users.save().then( function () {
        supersonic.ui.modal.hide();
      });
    }

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });

angular
  .module('users')
  .controller("IndexController", function ($scope, Users, supersonic) {
    $scope.userss = null;
    $scope.showSpinner = true;

    Users.all().whenChanged( function (userss) {
        $scope.$apply( function () {
          $scope.userss = userss;
          $scope.showSpinner = false;
        });
    });
  });
angular
  .module('users')
  .controller("NewController", function ($scope, Users, supersonic) {
    $scope.users = {};

    $scope.submitForm = function () {
      $scope.showSpinner = true;
      newusers = new Users($scope.users);
      newusers.save().then( function () {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });
angular
  .module('users')
  .controller("ShowController", function ($scope, Users, supersonic) {
    $scope.users = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _refreshViewData = function () {
      Users.find($scope.dataId).then( function (users) {
        $scope.$apply( function () {
          $scope.users = users;
          $scope.showSpinner = false;
        });
      });
    }

    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.dataId ) {
        _refreshViewData();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.dataId = values.id;
      _refreshViewData();
    });

    $scope.remove = function (id) {
      $scope.showSpinner = true;
      $scope.users.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    }
  });
angular
  .module('users')
  .constant('Users', supersonic.data.model('Users'));