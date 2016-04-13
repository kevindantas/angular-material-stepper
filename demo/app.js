/**
 * Created by NDS on 04/01/2016.
 */

angular.module('myApp', ['kds.stepper', 'textAngular']);
angular.module('myApp').config(function () {

});

angular.module('myApp').controller('myController', function($scope, $timeout){

  $scope.steps = {
    step1: true,
    step2: false,
    step3: false
  };

  $scope.user = {};

  $scope.messages = {
    begin: 'Carregando com interpolation ...',
    form: 'Carregando com interpolation ...',
    checkitout: 'Carregando com interpolation ...'
  };

  $scope.isLoading = false;


  $scope.create = function () {
    $scope.steps.step2 = true;
  };


  $scope.beginStep = function () {
    $scope.isLoading = true;
    $timeout(function() {
      $scope.steps.begin = true;
      $scope.isLoading = false;
      $scope.steps.begin = true;
    }, 2000);
  };


  /**
   * @description
   * Function to sign up the user
   */
  $scope.signUp = function (param) {
    $scope.steps.fillForm.loading = true;


    // Simulate time for the request the API
    $timeout(function (){
      //$scope.steps.fillForm.warning = true;
      $scope.steps.fillForm.loading = false;
      $scope.steps.fillForm.done = true;
    }, 5000);
  }

});