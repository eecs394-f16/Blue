angular
  .module('product')
  .controller("ShowController", ($scope, Product, supersonic) ->
    $scope.product = null
    $scope.showSpinner = true
    $scope.dataId = undefined

    _refreshViewData = ->
      Product.find($scope.dataId).then (product) ->
        $scope.$apply ->
          $scope.product = product
          $scope.showSpinner = false

    supersonic.ui.views.current.whenVisible ->
      _refreshViewData() if $scope.dataId

    supersonic.ui.views.current.params.onValue (values) ->
      $scope.dataId = values.id
      _refreshViewData()

    $scope.remove = (id) ->
      $scope.showSpinner = true
      $scope.product.delete().then ->
        supersonic.ui.layers.pop()
  )
