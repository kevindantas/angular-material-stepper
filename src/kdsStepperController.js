/**
 * @ngdoc controller
 * @name stepperController
 */
angular
  .module('kds.stepper')
  .controller('KdsStepperController', KdsStepperController);

function KdsStepperController($scope, $element, $attrs, $compile, $timeout, $mdUtil) {

  var self        = this;
  var parentScope = $scope.$parent;

  /** @type {Array.<Object>} */
  self.steps = [];

  /** @type {Array.<Object>} */
  self.element = $element;

  /** @type {Array.<Object>} */
  self.attrs = $attrs;

  //self.currentStep = 0;

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
    get: function () {

      if (self.attrOrientation == 'vertical' || self.attrOrientation == 'column')
        return 'column';
      else if (self.attrOrientation == 'horizontal' || self.attrOrientation == 'row')
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
  function evalScope(expression) {
    return parentScope.$eval(expression);
  }


  function init() {
    if (self.currentStep == undefined) self.currentStep = 0;
  }


  init();


  /**
   * @name changeStepItem
   * @description
   * Go to the next step by clicking on the pagination, only work if the `kds-step-item` is not disabled
   *
   * @param {object} e Event triggered by the user
   * @param {object} elemScope Scope of the current `kds-step-item`
   */
  this.changeStepItem = function (e, elemScope) {
    var target = e.target, item;
    if (target.localName == 'kds-step-item') {
      item = target;
    } else {
      target = $mdUtil.getClosest(target, 'kds-step-item');
    }


    if (!target.disabled) self.currentStep = elemScope.$index;

  };

  /**
   * @name isDisabled
   * @description
   * Disable the stepper items that are not optional
   *
   * @param {object} elemScope Scope of the element to be checked
   */
  self.isDisabled = function (elemScope){
    var step, previousStep, nextStep, isOptional = false;


    var elemIndex = elemScope.$index, // Current index of the element to be checked
        currentStep  = elemScope.step;    // Current step to be checked
    if (currentStep.done || elemIndex < self.currentStep) return false;

    if (elemIndex > 0){
      previousStep       = self.steps[elemScope.$index - 1];
      previousStep.index = elemScope.$index - 1;
      if (previousStep.done) return false;
    }

    if (elemIndex < self.steps.length - 1)
      nextStep = self.steps[elemScope.$index + 1];

    for (var i = 0; i < self.steps.length; i++){
      step = self.steps[i];

      if (previousStep !== undefined && previousStep.optional && self.currentStep == previousStep.index) return false;

      if ((!step.optional && self.currentStep != elemScope.$index) && (!step.optional && self.currentStep != elemScope.$index)) return true;

    }
    return isOptional;
  };


  /**
   * @name checkPage
   * @description
   * Check if the page should be visible
   */
  self.checkPage = function ($index) {
    return self.currentStep === $index;
  };


  /**
   * @event checkPage
   * @description
   * Check if the page should be visible
   */
  $scope.$watch(function () {
    return self.currentStep;
  }, function (newVal, oldVal) {
    $timeout(function () {
      var steps = $element.find('kds-step');

      if (newVal > oldVal) {
        steps.addClass('kds-left').removeClass('kds-right');
      } else if(oldVal !== 0) {
        steps.addClass('kds-right').removeClass('kds-left');
      }
    })
  });
}

KdsStepperController.$inject = ['$scope', '$element', '$attrs', '$compile', '$timeout', '$mdUtil'];