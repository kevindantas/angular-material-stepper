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

function KdsStepper($mdTheming) {
  return {
    scope: {
      selectedIndex: '=?kdsSelected',

    },
    restrict: 'EA',
    controller: 'KdsStepperController',
    controllerAs: '$kdsStepperCtrl',
    bindToController: true,
    transclude: true,
    template: function (elem, attr) {
      return '' +
            '<kds-steps-wrapper>' +
              '<kds-step-item flex layout="row" layout-align="center center" ng-repeat="step in $kdsStepperCtrl.steps" ' +
                'ng-disabled="step.index > $kdsStepperCtrl.currentStep+1" kds-step-done="false"' +
                'ng-class="{active: step.index == $kdsStepperCtrl.currentStep, disabled: step.index > $kdsStepperCtrl.currentStep}" md-ink-ripple="#aaa">' +
                '<md-button flex="none" class="md-fab md-mini md-primary"  md-no-ink  aria-label="{{step.attrs.kdsLabel}}" ng-switch on="$kdsStepperCtrl.doneSteps"> ' +
                  '<md-icon md-svg-icon="md-done" ng-show="step.done"></md-icon> {{ ($index + 1) }} ' +
                '</md-button>' +
                '{{kdsStepDone == true}}<span flex="none"> {{ step.attrs.kdsLabel ||  $kdsStepperCtrl.stepLabel + ($index+1) }}  </span>' +
                '<span flex style="height: 1px; background:rgba(0,0,0,.15); margin-left: 8px"></span> ' +
              '</kds-step-item>' +
            '</kds-steps-wrapper>'+
            '<kds-steps-content ng-transclude></kds-steps-content>';
    },
    link: function (scope, elem, attrs, controller) {
      $mdTheming(elem);
      var stepCount = elem.find('kds-step').length;
      controller.stepCount = stepCount;
    }
  }
}
KdsStepper.$inject = ['$mdTheming'];



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
    transclude: true,
    template: function () {
      return '<div layout="{{$kdsStepperCtrl.orientation}}" class="kds-steps-indicators" ng-transclude></div>';
    }
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
        console.log(scope);
        console.log(this);
        console.log(elem);
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
    require: '^kdsStepper',
    //transclude: true,
    //template: function () {
      //return '<div ng-transclude></div>';
    //}
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

function KdsStep() {
  return {
    restrict: 'E',
    // Require the instance of the parent controller, so each step is attached to a kds-stepper
    // '^' indicates a parent level
    require: '^kdsStepper',
    transclude: true,
    template: function (elem, attr, a) {
      return '' +
          '<div ng-show="true" ng-transclude data-test="{{$kdsStepperCtrl.currentStep}}">' +
          '</div>';
    },
    link: function (scope, elem, attrs, controller) {
      var kdsSteps = elem.parent().children();
      var i = Array.prototype.indexOf.call(kdsSteps, elem[0]);

      scope.currentStep = controller.currentStep;
      scope.$watch('currentStep', function (value, old, s) {
        if(i == value){

        }
      }, true)

      controller.steps.push({
        attrs: attrs,
        elem: elem,
        index: i,
        done: false,
        error: false
      });

    },
  }
}



/**
 * @ngdoc directive
 * @name kdsStepsWrapper
 * @description
 * The wrapper for the steps pagination
 * @restrict E*/
angular.module('kds.stepper')
  .directive('kdsStep2', KdsStep2);

function KdsStep2() {
  return {
    restrict: 'E',
    require: '^kdsStepper',
    template: function () {
      return '<div ng-show="true" data-test="{{$kdsStepperCtrl.currentStep}}">' +
        '</div>';
    }
  }
}
