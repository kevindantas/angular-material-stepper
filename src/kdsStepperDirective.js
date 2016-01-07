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
    scope: {

    },
    restrict: 'EA',
    controller: 'KdsStepperController',
    controllerAs: '$kdsStepperCtrl',
    bindToController: true,
    terminal: true,
    template: function (elem, attr){
      var steps = elem.children();
      attr.$kdsSteps = steps;
      return '' +
            '<kds-steps-wrapper layout="{{$kdsStepperCtrl.orientation}}"> </kds-steps-wrapper>'+
            '<kds-steps-content ng-repeat="step in $kdsStepperCtrl.steps">' +
              '<kds-step></kds-step>' +
            '</kds-steps-content>';
    },
    link: function (scope, elem, attr, controller, transclude) {
      var stepper = elem.contents();
      var templates = attr.$kdsSteps;
      var steps = [];
      for (var i = 0; i < templates.length; i++) {
        var step = {
          label: templates[i].getAttribute('label'),
          html: templates[i].innerHTML
        }
        steps.push(step);
      }
      //console.log(steps);
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
    require: '^kdsStepper',
    template: function () {
      return '' +
        '<kds-step-item flex layout="row" layout-align="center center" ng-repeat="step in $kdsStepperCtrl.steps" ' +
          'ng-disabled="step.index > $kdsStepperCtrl.currentStep+1" kds-step-done="false"' +
          'ng-class="{active: step.index == $kdsStepperCtrl.currentStep, disabled: step.index > $kdsStepperCtrl.currentStep}" md-ink-ripple="#aaa">' +
          '<md-button flex="none" class="md-fab md-mini md-primary"  md-no-ink  aria-label="{{step.attrs.kdsLabel}}" ng-switch on="$kdsStepperCtrl.doneSteps"> ' +
            '<md-icon md-svg-icon="md-done" ng-show="step.done"></md-icon> {{ ($index + 1) }} ' +
          '</md-button>' +
          '<span flex="none"> {{ step.label ||  $kdsStepperCtrl.stepLabel + ($index+1) }}  </span>' +
          '<span flex style="height: 1px; background:rgba(0,0,0,.15); margin-left: 8px"></span> ' +
        '</kds-step-item>' ;
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
    scope: {
      kdsStepDone: '=kdsStepDone'
    },
    restrict: 'E',
    require: '^kdsStepper',
    link: function (scope, elem, attr, controller) {
      elem.on('click', function (e) {
        scope.kdsStepDone = true
        attr.kdsStepDone = true;
      })
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

function kdsStepsContent () {
  return {
    restrict: 'E',
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
    restrict: 'E',
    require: '^kdsStepper',
    link: function (scope, elem, attrs, controller) {
      var kdsSteps = elem.parent().children();
      var i = Array.prototype.indexOf.call(kdsSteps, elem[0]);
      var stepContent = $compile(scope.step.html)(scope);
      elem.append(stepContent);
    },
  }
}



