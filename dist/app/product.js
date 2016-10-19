(function() {
  angular.module('product', ['common']);

}).call(this);

(function() {
  angular.module('product').controller("EditController", function($scope, Product, supersonic) {
    $scope.product = null;
    $scope.showSpinner = true;
    supersonic.ui.views.current.params.onValue(function(values) {
      return Product.find(values.id).then(function(product) {
        return $scope.$apply(function() {
          $scope.product = product;
          return $scope.showSpinner = false;
        });
      });
    });
    $scope.submitForm = function() {
      $scope.showSpinner = true;
      return $scope.product.save().then(function() {
        return supersonic.ui.modal.hide();
      });
    };
    return $scope.cancel = function() {
      return supersonic.ui.modal.hide();
    };
  });

}).call(this);

(function() {
  angular.module('product').controller("IndexController", function($scope, Product, supersonic) {
    $scope.products = null;
    $scope.showSpinner = true;
    return Product.all().whenChanged(function(products) {
      return $scope.$apply(function() {
        $scope.products = products;
        return $scope.showSpinner = false;
      });
    });
  });

}).call(this);

(function() {
  angular.module('product').controller("NewController", function($scope, Product, supersonic) {
    $scope.product = {};
    $scope.submitForm = function() {
      var newproduct;
      $scope.showSpinner = true;
      newproduct = new Product($scope.product);
      return newproduct.save().then(function() {
        return supersonic.ui.modal.hide();
      });
    };
    return $scope.cancel = function() {
      return supersonic.ui.modal.hide();
    };
  });

}).call(this);

(function() {
  angular.module('product').constant('Product', supersonic.data.model('Product'));

}).call(this);

(function() {
  angular.module('product').controller("ShowController", function($scope, Product, supersonic) {
    var _refreshViewData;
    $scope.product = null;
    $scope.showSpinner = true;
    $scope.dataId = void 0;
    _refreshViewData = function() {
      return Product.find($scope.dataId).then(function(product) {
        return $scope.$apply(function() {
          $scope.product = product;
          return $scope.showSpinner = false;
        });
      });
    };
    supersonic.ui.views.current.whenVisible(function() {
      if ($scope.dataId) {
        return _refreshViewData();
      }
    });
    supersonic.ui.views.current.params.onValue(function(values) {
      $scope.dataId = values.id;
      return _refreshViewData();
    });
    return $scope.remove = function(id) {
      $scope.showSpinner = true;
      return $scope.product["delete"]().then(function() {
        return supersonic.ui.layers.pop();
      });
    };
  });

}).call(this);
