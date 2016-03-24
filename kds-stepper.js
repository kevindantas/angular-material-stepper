/**
 * Created by NDS on 18/12/2015.
 */
//'use strict';
angular.module('kds.stepper', ['ngMaterial'])
  .config(['$mdIconProvider', function ($mdIconProvider) {
    $mdIconProvider.icon(iconDone.id, iconDone.url, 24);
    $mdIconProvider.icon(iconWarning.id, iconWarning.url, 24);
    $mdIconProvider.icon(iconError.id, iconError.url, 24);
  }])
  .run(['$http', '$templateCache', function ($http, $templateCache) {
    $templateCache.put(iconDone.url, iconDone.svg);
    $templateCache.put(iconWarning.url, iconWarning.svg);
    $templateCache.put(iconError.url, iconError.svg);
  }]);

var iconDone = {
  id:  'md-done',
  url: 'md-done.svg',
  svg: '<svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/> </svg>>'
};

var iconWarning = {
  id:  'md-warning',
  url: 'md-warning.svg',
  svg: '<svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/> </svg>'
};

var iconError = {
  id:  'md-error',
  url: 'md-error.svg',
  svg: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/> </svg>'
};
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
/**
 * @ngdoc directive
 * @name kdsStepper
 * @description
 * The directive `<kds-stepper>` serves as the container for `<kds-step>` child directives to produces a Stepper component.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <kds-stepper>
 *    <kds-step label="Tab #1"></kds-step>
 *    <kds-step label="Tab #2"></kds-step>
 *    <kds-step label="Tab #3"></kds-step>
 *  </kds-stepper>
 *  </hljs>
 *
 *  @param {=string} kds-orientation Stepper orientation
 *  @param {=integer} current-step Active step
 */
angular
  .module('kds.stepper')
  .directive('kdsStepper', KdsStepper);

function KdsStepper($mdTheming, $compile) {
  return {
    scope:            {
      currentStep: '=?',
      isLoading: '=?',
      loadingMessage: '=?'
    },
    restrict:         'EA',
    controller:       'KdsStepperController',
    controllerAs:     '$kdsStepperCtrl',
    bindToController: true,
    terminal:         true,
    template:         function (elem, attr) {
      var steps      = elem.children();
      attr.$kdsSteps = steps;
      return '' +
        '<kds-steps-message class="feedback-animation" ng-if="$kdsStepperCtrl.isLoading" layout="{{$kdsStepperCtrl.orientation}}" layout-align="left center">'+
        '<span>{{$kdsStepperCtrl.steps[$kdsStepperCtrl.currentStep].message}}</span>' +
        '</kds-steps-message>' +
        '<kds-steps-wrapper ng-if="!$kdsStepperCtrl.isLoading" layout="{{$kdsStepperCtrl.orientation}}"> </kds-steps-wrapper>' +
        '<kds-steps-content>' +
        '<kds-step-loading class="feedback-animation" ng-if="$kdsStepperCtrl.isLoading" layout="row" layout-align="center center">'+
        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>'+
        '</kds-step-loading>'+
        '<kds-step ng-if="$kdsStepperCtrl.checkPage($index)" ng-repeat="step in $kdsStepperCtrl.steps"></kds-step>' +
        '</kds-steps-content>';

    },
    link:             function (scope, elem, attr, controller, transclude) {
      var stepper   = elem.contents(),
          templates = attr.$kdsSteps,
          steps     = [],
          label, template, optional;

      for (var i = 0; i < templates.length; i++) {

        label = templates[i].getAttribute('label');
        templates[i].removeAttribute('label');

        //console.log(templates[i].getAttribute('message'));
        var message = templates[i].getAttribute('message') || controller.defaultMessage;
        template = templates[i];

        label = template.getAttribute('label');
        template.removeAttribute('label');


        var attrOptional = template.getAttribute('step-optional');
        optional         = attrOptional == "" || attrOptional == true;


        steps.push({
          label:    label,
          elem:     template,
          done:     false,
          message: message,
        optional: optional
        });
      }
      controller.steps = steps;
      $compile(stepper)(scope);
    }
  }
}
KdsStepper.$inject = ['$mdTheming', '$compile'];


/**
 * @ngdoc directive
 * @name kdsStepsWrapper
 * @description
 * The wrapper for the steps pagination
 * @restrict E
 */
angular.module('kds.stepper')
  .directive('kdsStepsWrapper', KdsStepperWrapper);

function KdsStepperWrapper() {
  return {
    restrict: 'E',
    require:  '^kdsStepper',
    template: function () {
      return '' +
        '<kds-step-item flex layout="row" layout-align="center center" ng-repeat="step in $kdsStepperCtrl.steps" ' +
        'ng-disabled="$kdsStepperCtrl.isDisabled(this)" kds-step-done="true" ng-click="$kdsStepperCtrl.changeStepItem($event, this)"' +
        'ng-class="{active: $index == $kdsStepperCtrl.currentStep}" md-ink-ripple="#aaa">' +
        '<md-button flex="none" class="md-fab md-mini md-primary"  md-no-ink  aria-label="{{step.attrs.kdsLabel}}">' +
        '<md-icon md-svg-icon="md-done" ng-show="step.done"></md-icon>' +
        '<md-icon md-svg-icon="md-warning" ng-show="step.warning"></md-icon>' +
        '<md-icon md-svg-icon="md-error" ng-show="step.error"></md-icon>' +
        '<span ng-show="!step.done">{{ ($index + 1) }}</span> ' +
        '</md-button>' +
        '<span flex="none"> {{ step.label ||  $kdsStepperCtrl.stepLabel + ($index+1) }}  </span>' +
        '<span flex style="height: 1px; background:rgba(0,0,0,.15); margin-left: 8px"></span> ' +
        '</kds-step-item>';
    }
  }
}


/**
 * @ngdoc directive
 * @name kdsStep
 * @description
 * Wrapper for the actual content of each step
 *
 * @restrict E
 */
angular.module('kds.stepper')
  .directive('kdsStepsContent', kdsStepsContent);

function kdsStepsContent() {
  return {
    restrict: 'E',
    require:  '^kdsStepper'
  };
}


/**
 * @ngdoc directive
 * @name kdsStep
 * @description
 * The directive `<kds-stepper>` serves as the container for `<kds-step>` child directives to produces a Stepper component.
 * @restrict E
 *
 *
 * @param {=boolean} stepOptional If the  step is required the following steps will be disabled
 */
angular
  .module('kds.stepper')
  .directive('kdsStep', KdsStep);

function KdsStep($compile) {
  return {
    terminal: true,
    restrict: 'E',
    require:  '^kdsStepper',
    link:     function (scope, elem, attrs, controller) {
      //ng-if="$kdsStepperCtrl.checkPage($index)" ng-repeat="step in $kdsStepperCtrl.steps"
      var stepElem      = scope.$parent.step.elem,
          attributesMap = stepElem.attributes;

      for (var j = 0; j < attributesMap.length; j++) {
        attrs.$set(normalizeName(attributesMap[j].name), attributesMap[j].value);
      }

      var kdsSteps    = elem.parent().children(),
          i           = Array.prototype.indexOf.call(kdsSteps, elem[0]),
          parentScope = scope.$parent.$parent.$parent, // TODO: Check if there's a better solution
          stepContent = $compile(stepElem.innerHTML)(parentScope);

      elem.append(stepContent);


      // Go to the next step if close the actual step
      scope.$watch(function () {
        return parentScope.$eval(attrs.stepDone);
      }, function (newVal, oldVal) {
        if (controller.steps[controller.currentStep]) {

        }
        if (newVal && !oldVal) {
          controller.steps[controller.currentStep].done = true;
          controller.currentStep++;
        }
      });


      // Indicate warning icon
      scope.$watch(function () {
        return parentScope.$eval(attrs.stepWarning);
      }, function (newVal, oldVal) {
        if (newVal) controller.steps[controller.currentStep].warning = true;
      });

      scope.$watch(function () {
        return parentScope.$eval(attrs.stepError);
      }, function (newVal, oldVal) {
        if (newVal) controller.steps[controller.currentStep].error = true;
      });


    }
  }
}
KdsStep.$inject = ['$compile'];


/**
 * @description
 * Transform a string with dash(-) separation into camelCase
 *
 * @param {string} name - string that should be normalized
 * @returns string
 */
function normalizeName(name) {
  var ind = name.indexOf('-');

  if (ind > -1) {
    name          = name.replace('-', '');
    var uppercase = name[ind].toUpperCase();
    name          = name.split('');
    name[ind]     = uppercase;
    name          = name.join('');
  }
  return name;
}