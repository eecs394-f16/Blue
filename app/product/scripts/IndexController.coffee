angular
  .module('product')
  .controller("IndexController", ($scope, Product, supersonic) ->
    $scope.products = null
    $scope.showSpinner = true

    Product.all().whenChanged (products) ->
      $scope.$apply ->
        $scope.products = products
        $scope.showSpinner = false
  )