/**
 * Created by NDS on 18/12/2015.
 */
//'use strict';
angular.module('kds.stepper', ['ngMaterial'])
  .config(function ($mdIconProvider) {
    $mdIconProvider.icon(iconDone.id, iconDone.url, 24);
  })
  .run(function ($http, $templateCache) {
    $templateCache.put(iconDone.url, iconDone.svg);
  });

var iconDone = {
  id:  'md-done',
  url: 'md-done.svg',
  svg: '<svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/> </svg>>'
};
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
      } else if(oldVal !== 0) {
        steps.addClass('kds-right').removeClass('kds-left');
      }
    })
  });
}

KdsStepperController.$inject = ['$scope', '$element', '$attrs', '$compile', '$timeout', '$mdUtil', '$mdTheming'];
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
 */
angular
  .module('kds.stepper')
  .directive('kdsStepper', KdsStepper);

function KdsStepper($mdTheming, $compile) {
  return {
    scope:            {
      currentStep: '=',
      isLoading: '=',
      loadingMessage: '='
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
          label, template;

      for (var i = 0; i < templates.length; i++) {
        label = templates[i].getAttribute('label');
        templates[i].removeAttribute('label');

        //console.log(templates[i].getAttribute('message'));
        var message = templates[i].getAttribute('message') || controller.defaultMessage;
        template = templates[i];
        steps.push({
          label: label,
          elem:  template,
          message: message
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
        'ng-disabled="$kdsStepperCtrl.isDisabled(this)" kds-step-done="true" ng-click="$kdsStepperCtrl.nextStepItem($event, this)"' +
        'ng-class="{active: $index == $kdsStepperCtrl.currentStep, disabled: $index > $kdsStepperCtrl.currentStep+1}" md-ink-ripple="#aaa">' +
        '<md-button flex="none" class="md-fab md-mini md-primary"  md-no-ink  aria-label="{{step.attrs.kdsLabel}}"' +
        'ng-disabled="$kdsStepperCtrl.isDisabled(this)">' +
        '<md-icon md-svg-icon="md-done" ng-show="step.done"></md-icon> <span ng-show="!step.done">{{ ($index + 1) }}</span> ' +
        '</md-button>' +
        '<span flex="none"> {{ step.label ||  $kdsStepperCtrl.stepLabel + ($index+1) }}  </span>' +
        '<span flex style="height: 1px; background:rgba(0,0,0,.15); margin-left: 8px"></span> ' +
        '</kds-step-item>';
    },
  }
}


/**
 * @ngdoc directive
 * @name kdsStepsWrapper
 * @description
 * The wrapper for the steps pagination
 * @restrict E
 */
angular.module('kds.stepper')
  .directive('kdsStepItem', KdsStepItem);

function KdsStepItem() {
  return {
    restrict: 'E',
    require:  '^kdsStepper',
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
          mdContent   = angular.element('<md-content></md-content>'),
          parentScope = scope.$parent.$parent.$parent, // TODO: Check if there's a better solution
          stepContent = $compile(stepElem.innerHTML)(parentScope);


      mdContent.append(stepContent);
      elem.append(mdContent);
      var a = this;

      // Go to the next step if close the actual step
      scope.$watch(function () {
        return parentScope.$eval(attrs.stepDone);
      }, function (newVal, oldVal, a, b) {
        if(newVal && !oldVal) {
          controller.steps[controller.currentStep].done = true;
          controller.currentStep++;
        }
      });
    }
  }
}
KdsStep.$inject = ['$compile'];


function normalizeName(name) {
  var ind       = name.indexOf('-');

  if (ind > -1) {
    name          = name.replace('-', '');
    var uppercase = name[ind].toUpperCase();
    name          = name.split('');
    name[ind]     = uppercase;
    name          = name.join('');
  }
  return name;
}