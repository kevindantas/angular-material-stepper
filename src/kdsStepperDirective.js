angular
/**
 * @ngdoc directive
 * @name kdsStep
 * @module kds.stepper
 *
 * @restrict E
 *
 * @description
 * Use the `<kds-step>` a nested directive used within `<kds-stepper>` to specify a step with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<kds-step-label>` tag can be used to specify more
 * complex step header markup. If neither the **label** nor the **kds-step-label** are specified, then the nested
 * markup of the `<kds-step>` is used as the step header markup.
 *
 * Please note that if you use `<kds-step-label>`, your content **MUST** be wrapped in the `<kds-step-body>` tag.  This
 * is to define a clear separation between the step content and the step label.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the step selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the step label
 * @param {boolean=} ng-disabled If present and expression evaluates to truthy, disabled step selection.
 * @param {expression=} md-on-deselect Expression to be evaluated after the step has been de-selected.
 * @param {expression=} md-on-select Expression to be evaluated after the step has been selected.
 * @param {boolean=} md-active When true, sets the active tab.  Note: There can only be one active step at a time.
 * @param {boolean=} kds-done When true, sets the step selectable.  Note: Should be a assignable value,
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <kds-step label="" ng-disabled md-on-select="" md-on-deselect="" >
 *   <h3>My Tab content</h3>
 * </kds-step>
 *
 * <kds-step >
 *   <kds-step-label>
 *     <h3>My Tab content</h3>
 *   </kds-step-label>
 *   <kds-step-body>
 *     <p>
 *       Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *       totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *       dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *       sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *     </p>
 *   </kds-step-body>
 * </kds-step>
 * </hljs>
 *
 */
angular
  .module('kds.stepper')
  .directive('kdsStep', KdsStep);

function KdsStep() {
  return {
    require:  '^?kdsStepper',
    terminal: true,
    compile:  function (element, attr, a) {
      var label = firstChild(element, 'kds-step-label'),
          body  = firstChild(element, 'kds-step-body');

      if (label.length == 0) {
        label = angular.element('<kds-step-label></kds-step-label>');
        if (attr.label) label.text(attr.label);
        else label.append(element.contents());

        if (body.length == 0) {
          var contents = element.contents().detach();
          body         = angular.element('<kds-step-body></kds-step-body>');
          body.append(contents);
        }
      }
      // var index = ctrl.getTabElementIndex(element);
      // console.log(index);

      var button = angular.element('<md-button class="md-primary md-raised md-fab md-mini">1</md-button>');

      element.append(label);
      if (body.html()) element.append(body);

      return postLink;
    },
    scope:    {
      active:   '=?mdActive',
      disabled: '=?ngDisabled',
      select:   '&?mdOnSelect',
      deselect: '&?mdOnDeselect',
      done:     '=?kdsDone'
    }
  };

  function postLink(scope, element, attr, ctrl) {
    if (!ctrl) return;
    var index = ctrl.getTabElementIndex(element),
        body  = firstChild(element, 'kds-step-body').remove(),
        label = firstChild(element, 'kds-step-label').remove(),
        data  = ctrl.insertTab({
          scope:    scope,
          parent:   scope.$parent,
          index:    index,
          element:  element,
          template: body.html(),
          label:    label.html()
        }, index);


    scope.$watch('done', function (val) {
      scope.disabled = val === false;
    });

    scope.select   = scope.select || angular.noop;
    scope.deselect = scope.deselect || angular.noop;
    scope.$watch('active', function (active) {
      if (active) ctrl.select(data.getIndex(), true);
    });
    scope.$watch('disabled', function () {
      ctrl.refreshIndex();
    });
    scope.$watch(
      function () {
        return ctrl.getTabElementIndex(element);
      },
      function (newIndex) {
        data.index = newIndex;
        ctrl.updateTabOrder();
      }
    );
    scope.$on('$destroy', function () {
      ctrl.removeTab(data);
    });
  }

  function firstChild(element, tagName) {
    var children = element[0].children;
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if (child.tagName === tagName.toUpperCase()) return angular.element(child);
    }
    return angular.element();
  }
}

angular
  .module('kds.stepper')
  .directive('kdsStepItem', KdsStepItem);

function KdsStepItem () {
  return {
    require: '^?kdsStepper',
    link:    function link(scope, element, attr, ctrl) {
      if (!ctrl) return;
      ctrl.attachRipple(scope, element);
    }
  };
}

angular
  .module('kds.stepper')
  .directive('kdsStepLabel', KdsStepLabel);

function KdsStepLabel() {
  return {terminal: true};
}


angular.module('kds.stepper')
  .directive('kdsStepScroll', KdsStepScroll);

function KdsStepScroll($parse) {
  return {
    restrict: 'A',
    compile:  function ($element, attr) {
      var fn = $parse(attr.kdsStepScroll, null, true);
      return function ngEventHandler(scope, element) {
        element.on('mousewheel', function (event) {
          scope.$apply(function () {
            fn(scope, {$event: event});
          });
        });
      };
    }
  }
}
KdsStepScroll.$inject = ["$parse"];


/**
 * @ngdoc directive
 * @name mdTabs
 * @module kds.stepper
 *
 * @restrict E
 *
 * @description
 * The `<kds-stepper>` directive serves as the container for 1..n `<kds-step>` child directives to produces a Tabs components.
 * In turn, the nested `<kds-step>` directive is used to specify a step label for the **header button** and a [optional] step view
 * content that will be associated with each step button.
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
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when step buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each step has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each step is independently managed and data-binding notifications announce step selection changes.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a step is disabled while active/selected, then the next step will be auto-selected.
 *
 * ### Explanation of step stretching
 *
 * Initially, tabs will have an inherent size.  This size will either be defined by how much space is needed to accommodate their text or set by the user through CSS.  Calculations will be based on this size.
 *
 * On mobile devices, tabs will be expanded to fill the available horizontal space.  When this happens, all tabs will become the same size.
 *
 * On desktops, by default, stretching will never occur.
 *
 * This default behavior can be overridden through the `md-stretch-tabs` attribute.  Here is a table showing when stretching will occur:
 *
 * `md-stretch-tabs` | mobile    | desktop
 * ------------------|-----------|--------
 * `auto`            | stretched | ---
 * `always`          | stretched | stretched
 * `never`           | ---       | ---
 *
 * @param {integer=} md-selected Index of the active/selected tab
 * @param {boolean=} md-no-ink If present, disables ink ripple effects.
 * @param {boolean=} md-no-ink-bar If present, disables the selection ink bar.
 * @param {string=}  md-align-tabs Attribute to indicate position of step buttons: `bottom` or `top`; default is `top`
 * @param {string=} md-stretch-tabs Attribute to indicate whether or not to stretch tabs: `auto`, `always`, or `never`; default is `auto`
 * @param {boolean=} md-dynamic-height When enabled, the step wrapper will resize based on the contents of the selected tab
 * @param {boolean=} md-border-bottom If present, shows a solid `1px` border between the tabs and their content
 * @param {boolean=} md-center-tabs When enabled, tabs will be centered provided there is no need for pagination
 * @param {boolean=} md-no-pagination When enabled, pagination will remain off
 * @param {boolean=} md-swipe-content When enabled, swipe gestures will be enabled for the content area to jump between tabs
 * @param {boolean=} md-enable-disconnect When enabled, scopes will be disconnected for tabs that are not being displayed.  This provides a performance boost, but may also cause unexpected issues and is not recommended for most users.
 * @param {boolean=} md-autoselect When present, any tabs added after the initial load will be automatically selected
 * @param {boolean=} md-no-select-click When enabled, click events will not be fired when selecting tabs
 *
 * @usage
 * <hljs lang="html">
 * <kds-stepper md-selected="selectedIndex" >
 *   <img ng-src="img/angular.png" class="centered">
 *   <md-tab
 *       ng-repeat="step in tabs | orderBy:predicate:reversed"
 *       md-on-select="onTabSelected(tab)"
 *       md-on-deselect="announceDeselected(tab)"
 *       ng-disabled="tab.disabled">
 *     <kds-step-label>
 *       {{tab.title}}
 *       <img src="img/removeTab.png" ng-click="removeTab(tab)" class="delete">
 *     </kds-step-label>
 *     <kds-step-body>
 *       {{tab.content}}
 *     </kds-step-body>
 *   </kds-step>
 * </kds-stepper>
 * </hljs>
 *
 */
angular
  .module('kds.stepper')
  .directive('kdsStepper', KdsStepper);

function KdsStepper() {
  return {
    scope:            {
      selectedIndex: '=?mdSelected'
    },
    template:         function (element, attr) {
      attr["$kdsStepsTemplate"] = element.html();
      return '' +
        '<kds-steps-wrapper> ' +
          '<kds-step-data></kds-step-data> ' +
          '<md-prev-button tabindex="-1" role="button" aria-label="Previous Step" ' +
          'aria-disabled="{{!$kdsStepperCtrl.canPageBack()}}" ' +
          'ng-class="{ \'md-disabled\': !$kdsStepperCtrl.canPageBack() }" ' +
          'ng-if="$kdsStepperCtrl.shouldPaginate" ' +
          'ng-click="$kdsStepperCtrl.previousPage()"> ' +
          '<md-icon md-svg-icon="md-tabs-arrow"></md-icon> ' +
          '</md-prev-button> ' +

          '<md-next-button ' +
          'tabindex="-1" ' +
          'role="button" ' +
          'aria-label="Next Step" ' +
          'aria-disabled="{{!$kdsStepperCtrl.canPageForward()}}" ' +
          'ng-class="{ \'md-disabled\': !$kdsStepperCtrl.canPageForward() }" ' +
          'ng-if="$kdsStepperCtrl.shouldPaginate" ' +
          'ng-click="$kdsStepperCtrl.nextPage()"> ' +
          '<md-icon md-svg-icon="md-tabs-arrow"></md-icon> ' +
          '</md-next-button> ' +

          '<kds-steps-canvas role="tablist"' +
          'tabindex="{{ $kdsStepperCtrl.hasFocus ? -1 : 0 }}" ' +
          'aria-activedescendant="tab-item-{{$kdsStepperCtrl.steps[$kdsStepperCtrl.focusIndex].id}}" ' +
          'ng-focus="$kdsStepperCtrl.redirectFocus()" ' +
          'ng-class="{ ' +
          '\'md-paginated\': $kdsStepperCtrl.shouldPaginate, ' +
          '\'md-center-tabs\': $kdsStepperCtrl.shouldCenterTabs ' +
          '}" ' +
          'ng-keydown="$kdsStepperCtrl.keydown($event)"> ' +

            '<kds-pagination-wrapper ' +
            'ng-class="{ \'md-center-tabs\': $kdsStepperCtrl.shouldCenterTabs }" ' +
            'md-tab-scroll="$kdsStepperCtrl.scroll($event)"> ' +

              '<kds-step-item tabindex="-1" class="kds-step" role="tab" ' +
              'ng-repeat="tab in $kdsStepperCtrl.steps" ' +
              'aria-controls="tab-content-{{::tab.id}}" ' +
              'aria-selected="{{tab.isActive()}}" ' +
              'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
              'ng-click="$kdsStepperCtrl.select(tab.getIndex())" ' +
              'ng-class="{ ' +
              '\'md-active\':    tab.isActive(), ' +
              '\'md-focused\':   tab.hasFocus(), ' +
              '\'md-disabled\':  tab.scope.disabled ' +
              '}" ' +
              'ng-disabled="tab.scope.disabled" ' +
              'md-swipe-left="$kdsStepperCtrl.nextPage()" ' +
              'md-swipe-right="$kdsStepperCtrl.previousPage()" ' +
              'kds-steps-template="::tab.label" ' +
              'md-scope="::tab.parent"> <md-button class="md-primary md-raised md-fab md-mini"> $index </md-button>  </kds-step-item> ' +

              '<md-ink-bar></md-ink-bar> ' +
            '</kds-pagination-wrapper> ' +

            '<div class="md-visually-hidden md-dummy-wrapper"> ' +
              '<kds-dummy-tab class = "kds-step" role="tab" tabindex="-1" id="tab-item-{{::tab.id}}" ' +
              'aria-controls="tab-content-{{::tab.id}}" ' +
              'aria-selected="{{tab.isActive()}}" ' +
              'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
              'ng-focus="$kdsStepperCtrl.hasFocus = true" ' +
              'ng-blur="$kdsStepperCtrl.hasFocus = false" ' +
              'ng-repeat="tab in $kdsStepperCtrl.steps" ' +
              'kds-steps-template="::tab.label" ' +
              'md-scope="::tab.parent"></kds-dummy-tab> ' +
            '</div> ' +
          '</kds-steps-canvas>' +
        '</kds-steps-wrapper> ' +


        '<kds-steps-content-wrapper ng-show="$kdsStepperCtrl.hasContent && $kdsStepperCtrl.selectedIndex >= 0"> ' +
          '<kds-step-content id="tab-content-{{::tab.id}}" role="tabpanel" ' +
          'aria-labelledby="tab-item-{{::tab.id}}" ' +
          'md-swipe-left="$kdsStepperCtrl.swipeContent && $kdsStepperCtrl.incrementIndex(1)" ' +
          'md-swipe-right="$kdsStepperCtrl.swipeContent && $kdsStepperCtrl.incrementIndex(-1)" ' +
          'ng-if="$kdsStepperCtrl.hasContent" ' +
          'ng-repeat="(index, tab) in $kdsStepperCtrl.steps" ' +
          'ng-class="{ ' +
          '\'md-no-transition\': $kdsStepperCtrl.lastSelectedIndex == null, ' +
          '\'md-active\':        tab.isActive(), ' +
          '\'md-left\':          tab.isLeft(), ' +
          '\'md-right\':         tab.isRight(), ' +
          '\'md-no-scroll\':     $kdsStepperCtrl.dynamicHeight ' +
          '}"> ' +
            '<div ' +
            'kds-steps-template="::tab.template" ' +
            'md-connected-if="tab.isActive()" ' +
            'md-scope="::tab.parent" ' +
            'ng-if="$kdsStepperCtrl.enableDisconnect || tab.shouldRender()"></div> ' +
          '</kds-step-content> ' +
        '</kds-steps-content-wrapper>';
    },
    controller:       'KdsStepperController',
    controllerAs:     '$kdsStepperCtrl',
    bindToController: true
  };
}

angular
  .module('kds.stepper')
  .directive('kdsStepsTemplate', KdsStepsTemplate);

function KdsStepsTemplate($compile, $mdUtil) {
  return {
    restrict: 'A',
    link:     link,
    scope:    {
      template:     '=kdsStepsTemplate',
      connected:    '=?mdConnectedIf',
      compileScope: '=mdScope'
    },
    require:  '^?kdsStepper'
  };
  function link (scope, element, attr, ctrl) {
    if (!ctrl) return;
    var compileScope = ctrl.enableDisconnect ? scope.compileScope.$new() : scope.compileScope;
    element.html(scope.template);
    $compile(element.contents())(compileScope);
    element.on('DOMSubtreeModified', function () {
      ctrl.updatePagination();
      ctrl.updateInkBarStyles();
    });
    return $mdUtil.nextTick(handleScope);

    function handleScope () {
      scope.$watch('connected', function (value) {
        value === false ? disconnect() : reconnect();
      });
      scope.$on('$destroy', reconnect);
    }

    function disconnect () {
      if (ctrl.enableDisconnect) $mdUtil.disconnectScope(compileScope);
    }

    function reconnect () {
      if (ctrl.enableDisconnect) $mdUtil.reconnectScope(compileScope);
    }
  }
}
KdsStepsTemplate.$inject = ["$compile", "$mdUtil"];