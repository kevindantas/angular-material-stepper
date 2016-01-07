/**
 * @ngdoc controller
 * @name stepperController
 */
angular
    .module('kds.stepper')
    .controller('KdsStepperController', KdsStepperController);

function KdsStepperController ($scope, $element, $attrs, $transclude, $mdTheming) {

  var _element = angular.element($element);


  /** @type {number} */
  this.currentStep = 1;

  /** @type {Array.<Object>} */
  this.steps = [];

  /**
   * Default label as the name of the step. e.g.: Step {{stepIndex}}
   * @type {string}
   */
  this.defaultStepLabel = 'Step ';


  this.stepLabel = this.defaultStepLabel;


  /** @type {Array.<Object>} */
  this.doneSteps = [];




  /**
   * Get the value from the kdsOrientation attribute
   * @type {string}
   */
  this.attrOrientation = $attrs.kdsOrientation || 'horizontal';

  /**
   * Get the orientation that will be used in the `layout` directive from Angular Material Design
   * @type {string}
   */
  Object.defineProperty(this, 'orientation', {
    get: function() {
      if(this.attrOrientation == 'vertical')
        return 'column';
      else
        return 'row';
    },
  });


};

KdsStepperController.$inject = ['$scope', '$element', '$attrs', '$transclude', '$mdTheming'];