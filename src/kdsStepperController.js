/**
 * @ngdoc controller
 * @name stepperController
 */
angular
    .module('kds.stepper')
    .controller('KdsStepperController', KdsStepperController);

function KdsStepperController ($scope, $element, $attrs, $compile, $timeout, $mdUtil, $mdTheming) {

  var self = this;
  var parentScope = $scope.$parent;

  /** @type {Array.<Object>} */
  self.steps = [];

  /** @type {Array.<Object>} */
  self.element = $element;

  /** @type {Array.<Object>} */
  self.attrs = $attrs;

  /**
   * Default label as the name of the step. e.g.: Step {{stepIndex}}
   * @type {string}
   */
  self.defaultStepLabel = 'Step ';


  /** @type {string} */
  self.stepLabel = self.defaultStepLabel;

  /** @type {Array.<Object>} */
  self.doneSteps = [];

  /**
   * Get the value from the kdsOrientation attribute
   * @type {string}
   */
  self.attrOrientation = $attrs.kdsOrientation || 'horizontal';
  
  /**
   * Get the orientation that will be used in the `layout` directive from Angular Material Design
   * @type {string}
   */
  Object.defineProperty(self, 'orientation', {
    get: function() {

      if(self.attrOrientation == 'vertical' || self.attrOrientation == 'column')
        return 'column';
      else if(self.attrOrientation == 'horizontal' || self.attrOrientation == 'row')
        return 'row';

    }
  });


  /**
   * @name evalScope
   * @description
   * Use the parent scope to eval the expressions
   *
   * @param {void} expression Expression to be eval
   */
  function evalScope (expression) {
    return parentScope.$eval(expression);
  }


  
  function init () {
    if(self.currentStep == undefined) self.currentStep = 0;
  }


  init();
  

  /**
   * @name nextStepItem
   * @description
   * Go to the next step by clicking on the pagination, only work if the `kds-step-item` is not disabled
   *
   * @param {object} e Event triggered by the user
   * @param {object} elemScope Scope of the current `kds-step-item`
   */
  this.nextStepItem = function (e, elemScope){
    var target = e.target, item;
    if(target.localName == 'kds-step-item'){
      item = target;
    } else {
      target = $mdUtil.getClosest(target, 'kds-step-item');
    }

    if(!target.disabled) self.currentStep = elemScope.$index;

  };


  /**
   * @name isDisabled
   * @description
   * Disable the stepper items
   *
   * @param {object} elemScope Scope of the element
   */
  self.isDisabled = function (elemScope) {
    return (elemScope.$index > self.currentStep+1);
  };


  /**
   * @name checkPage
   * @description
   * Check if the page should be visible
   */
  self.checkPage = function ($index) {
    return self.currentStep === $index;
  };


  // TODO: Check CSS animation
  $scope.$watch(function () {
    return self.currentStep;
  }, function (newVal, oldVal) {

    $timeout(function () {
      var steps = $element.find('kds-step');

      if(newVal > oldVal) {
        steps.addClass('kds-left').removeClass('kds-right');
      } else {
        steps.addClass('kds-right').removeClass('kds-left');
      }
    })
  });
}

KdsStepperController.$inject = ['$scope', '$element', '$attrs', '$compile', '$timeout', '$mdUtil', '$mdTheming'];