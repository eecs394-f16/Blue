angular
  .module('product')
  .controller("NewController", ($scope, Product, supersonic) ->
    $scope.product = {}

    $scope.submitForm = ->
      $scope.showSpinner = true
      newproduct = new Product($scope.product)
      newproduct.save().then ->
        supersonic.ui.modal.hide()

    $scope.cancel = ->
      supersonic.ui.modal.hide()
  )
