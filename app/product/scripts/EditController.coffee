angular
  .module('product')
  .controller("EditController", ($scope, Product, supersonic) ->
    $scope.product = null
    $scope.showSpinner = true

    supersonic.ui.views.current.params.onValue (values) ->
      Product.find(values.id).then (product) ->
        $scope.$apply ->
          $scope.product = product
          $scope.showSpinner = false

    $scope.submitForm = ->
      $scope.showSpinner = true
      $scope.product.save().then ->
        supersonic.ui.modal.hide()

    $scope.cancel = ->
      supersonic.ui.modal.hide()
  )
