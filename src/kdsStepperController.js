/**
 * @ngdoc controller
 * @name stepperController
 */
angular
    .module('kds.stepper')
    .controller('KdsStepperController', KdsStepperController);

function KdsStepperController ($scope, $element, $attrs, $compile, $mdTheming) {

  var _element = angular.element($element);
  var self = this;

  /** @type {number} */
  self.currentStep = 1;

  /** @type {Array.<Object>} */
  self.steps = [];

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
      if(self.attrOrientation == 'vertical')
        return 'column';
      else
        return 'row';
    },
  });


  function init() {

  }

  init();


  this.compileStepper = function (contents, scope) {
    var steps = $attrs.$kdsSteps;
    var arr = [];
    for (var i = 0; i < steps.length; i++) {
      var step = {
        label: steps[i].attributes.label,
        html: steps[i].innerHTML
      }
    }
    //$compile(contents)(scope);
  }



};

KdsStepperController.$inject = ['$scope', '$element', '$attrs', '$compile', '$mdTheming'];