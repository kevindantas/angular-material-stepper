/**
 * Created by NDS on 04/01/2016.
 */

angular.module('myApp', ['kds.stepper']);
angular.module('myApp').config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('myNewPaletteName', {
    '50': 'ffebee',
    '100': 'ffcdd2',
    '200': 'ef9a9a',
    '300': 'e57373',
    '400': 'ef5350',
    '500': 'f44336',
    '600': 'e53935',
    '700': 'd32f2f',
    '800': 'c62828',
    '900': 'b71c1c',
    'A100': 'ff8a80',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
      '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('mytheme')
      .primaryPalette('myNewPaletteName')
});

angular.module('myApp').controller('myController', function($scope, $timeout){
  $scope.myStep = 0;

  $scope.steps = {
    begin: false,
    fillForm: false
  };


  $scope.user = {
    nome: 'dawdaw'
  };

  $scope.messages = {
    begin: 'Carregando com interpolation ...',
    form: 'Carregando com interpolation ...',
    checkitout: 'Carregando com interpolation ...'
  }

  $scope.isLoading = false;

  $scope.beginStep = function() {
    $scope.isLoading = true;
    $timeout(function() {
      $scope.steps.begin = true;
      $scope.isLoading = false;
      $scope.steps.begin = true;
    }, 2000);
  }

  //console.log($scope);

  $scope.isTrue = function (param) {
    if(param !== undefined){
      return param;
    }
    return true;
  }
});