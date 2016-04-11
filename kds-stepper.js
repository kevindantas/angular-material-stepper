/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.0.6
 */
(function( window, angular, undefined ){
"use strict";

/**
 * @ngdoc module
 * @name kds.stepper
 * @description
 *
 *  Tabs, created with the `<md-tabs>` directive provide *tabbed* navigation with different styles.
 *  The Tabs component consists of clickable tabs that are aligned horizontally side-by-side.
 *
 *  Features include support for:
 *
 *  - static or dynamic tabs,
 *  - responsive designs,
 *  - accessibility support (ARIA),
 *  - tab pagination,
 *  - external or internal tab content,
 *  - focus indicators and arrow-key navigations,
 *  - programmatic lookup and access to tab controllers, and
 *  - dynamic transitions through different tab contents.
 *
 */
/*
 * @see js folder for tabs implementation
 */
angular.module('kds.stepper', [
  'material.core',
  'material.components.icon'
]);

/**
 * @ngdoc directive
 * @name mdTab
 * @module kds.stepper
 *
 * @restrict E
 *
 * @description
 * Use the `<md-tab>` a nested directive used within `<md-tabs>` to specify a tab with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<md-tab-label>` tag can be used to specify more
 * complex tab header markup. If neither the **label** nor the **md-tab-label** are specified, then the nested
 * markup of the `<md-tab>` is used as the tab header markup.
 *
 * Please note that if you use `<md-tab-label>`, your content **MUST** be wrapped in the `<md-tab-body>` tag.  This
 * is to define a clear separation between the tab content and the tab label.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the tab selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the tab label
 * @param {boolean=} ng-disabled If present, disabled tab selection.
 * @param {expression=} md-on-deselect Expression to be evaluated after the tab has been de-selected.
 * @param {expression=} md-on-select Expression to be evaluated after the tab has been selected.
 * @param {boolean=} md-active When true, sets the active tab.  Note: There can only be one active tab at a time.
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <md-tab label="" disabled="" md-on-select="" md-on-deselect="" >
 *   <h3>My Tab content</h3>
 * </md-tab>
 *
 * <md-tab >
 *   <md-tab-label>
 *     <h3>My Tab content</h3>
 *   </md-tab-label>
 *   <md-tab-body>
 *     <p>
 *       Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *       totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *       dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *       sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *     </p>
 *   </md-tab-body>
 * </md-tab>
 * </hljs>
 *
 */
angular
    .module('kds.stepper')
    .directive('mdTab', MdTab);

function MdTab () {
  return {
    require:  '^?mdTabs',
    terminal: true,
    compile:  function (element, attr) {
      var label = firstChild(element, 'md-tab-label'),
          body  = firstChild(element, 'md-tab-body');

      if (label.length == 0) {
        label = angular.element('<md-tab-label></md-tab-label>');
        if (attr.label) label.text(attr.label);
        else label.append(element.contents());

        if (body.length == 0) {
          var contents = element.contents().detach();
          body         = angular.element('<md-tab-body></md-tab-body>');
          body.append(contents);
        }
      }

      element.append(label);
      if (body.html()) element.append(body);

      return postLink;
    },
    scope:    {
      active:   '=?mdActive',
      disabled: '=?ngDisabled',
      select:   '&?mdOnSelect',
      deselect: '&?mdOnDeselect'
    }
  };

  function postLink (scope, element, attr, ctrl) {
    if (!ctrl) return;
    var index = ctrl.getTabElementIndex(element),
        body  = firstChild(element, 'md-tab-body').remove(),
        label = firstChild(element, 'md-tab-label').remove(),
        data  = ctrl.insertTab({
          scope:    scope,
          parent:   scope.$parent,
          index:    index,
          element:  element,
          template: body.html(),
          label:    label.html()
        }, index);

    scope.select   = scope.select || angular.noop;
    scope.deselect = scope.deselect || angular.noop;

    scope.$watch('active', function (active) { if (active) ctrl.select(data.getIndex()); });
    scope.$watch('disabled', function () { ctrl.refreshIndex(); });
    scope.$watch(
        function () {
          return ctrl.getTabElementIndex(element);
        },
        function (newIndex) {
          data.index = newIndex;
          ctrl.updateTabOrder();
        }
    );
    scope.$on('$destroy', function () { ctrl.removeTab(data); });
  }

  function firstChild (element, tagName) {
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
    .directive('mdTabItem', MdTabItem);

function MdTabItem () {
  return {
    require: '^?mdTabs',
    link:    function link (scope, element, attr, ctrl) {
      if (!ctrl) return;
      ctrl.attachRipple(scope, element);
    }
  };
}

angular
    .module('kds.stepper')
    .directive('mdTabLabel', MdTabLabel);

function MdTabLabel () {
  return { terminal: true };
}


angular.module('kds.stepper')
    .directive('mdTabScroll', MdTabScroll);

function MdTabScroll ($parse) {
  return {
    restrict: 'A',
    compile: function ($element, attr) {
      var fn = $parse(attr.mdTabScroll, null, true);
      return function ngEventHandler (scope, element) {
        element.on('mousewheel', function (event) {
          scope.$apply(function () { fn(scope, { $event: event }); });
        });
      };
    }
  }
}
MdTabScroll.$inject = ["$parse"];

/**
 * @ngdoc directive
 * @name mdTabs
 * @module kds.stepper
 *
 * @restrict E
 *
 * @description
 * The `<md-tabs>` directive serves as the container for 1..n `<md-tab>` child directives to produces a Tabs components.
 * In turn, the nested `<md-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view
 * content that will be associated with each tab button.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <md-tabs>
 *    <md-tab label="Tab #1"></md-tab>
 *    <md-tab label="Tab #2"></md-tab>
 *    <md-tab label="Tab #3"></md-tab>
 *  </md-tabs>
 *  </hljs>
 *
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a tab is disabled while active/selected, then the next tab will be auto-selected.
 *
 * ### Explanation of tab stretching
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
 * @param {string=}  md-align-tabs Attribute to indicate position of tab buttons: `bottom` or `top`; default is `top`
 * @param {string=} md-stretch-tabs Attribute to indicate whether or not to stretch tabs: `auto`, `always`, or `never`; default is `auto`
 * @param {boolean=} md-dynamic-height When enabled, the tab wrapper will resize based on the contents of the selected tab
 * @param {boolean=} md-border-bottom If present, shows a solid `1px` border between the tabs and their content
 * @param {boolean=} md-center-tabs When enabled, tabs will be centered provided there is no need for pagination
 * @param {boolean=} md-no-pagination When enabled, pagination will remain off
 * @param {boolean=} md-swipe-content When enabled, swipe gestures will be enabled for the content area to jump between tabs
 * @param {boolean=} md-enable-disconnect When enabled, scopes will be disconnected for tabs that are not being displayed.  This provides a performance boost, but may also cause unexpected issues and is not recommended for most users.
 * @param {boolean=} md-autoselect When present, any tabs added after the initial load will be automatically selected
 *
 * @usage
 * <hljs lang="html">
 * <md-tabs md-selected="selectedIndex" >
 *   <img ng-src="img/angular.png" class="centered">
 *   <md-tab
 *       ng-repeat="tab in tabs | orderBy:predicate:reversed"
 *       md-on-select="onTabSelected(tab)"
 *       md-on-deselect="announceDeselected(tab)"
 *       ng-disabled="tab.disabled">
 *     <md-tab-label>
 *       {{tab.title}}
 *       <img src="img/removeTab.png" ng-click="removeTab(tab)" class="delete">
 *     </md-tab-label>
 *     <md-tab-body>
 *       {{tab.content}}
 *     </md-tab-body>
 *   </md-tab>
 * </md-tabs>
 * </hljs>
 *
 */
angular
    .module('kds.stepper')
    .directive('mdTabs', MdTabs);

function MdTabs () {
  return {
    scope:            {
      selectedIndex: '=?mdSelected'
    },
    template:         function (element, attr) {
      attr[ "$mdTabsTemplate" ] = element.html();
      return '' +
        '<md-tabs-wrapper> ' +
          '<md-tab-data></md-tab-data> ' +
          '<md-prev-button ' +
              'tabindex="-1" ' +
              'role="button" ' +
              'aria-label="Previous Page" ' +
              'aria-disabled="{{!$kdsStepperCtrl.canPageBack()}}" ' +
              'ng-class="{ \'md-disabled\': !$kdsStepperCtrl.canPageBack() }" ' +
              'ng-if="$kdsStepperCtrl.shouldPaginate" ' +
              'ng-click="$kdsStepperCtrl.previousPage()"> ' +
            '<md-icon md-svg-icon="md-tabs-arrow"></md-icon> ' +
          '</md-prev-button> ' +
          '<md-next-button ' +
              'tabindex="-1" ' +
              'role="button" ' +
              'aria-label="Next Page" ' +
              'aria-disabled="{{!$kdsStepperCtrl.canPageForward()}}" ' +
              'ng-class="{ \'md-disabled\': !$kdsStepperCtrl.canPageForward() }" ' +
              'ng-if="$kdsStepperCtrl.shouldPaginate" ' +
              'ng-click="$kdsStepperCtrl.nextPage()"> ' +
            '<md-icon md-svg-icon="md-tabs-arrow"></md-icon> ' +
          '</md-next-button> ' +
          '<md-tabs-canvas ' +
              'tabindex="{{ $kdsStepperCtrl.hasFocus ? -1 : 0 }}" ' +
              'aria-activedescendant="tab-item-{{$kdsStepperCtrl.tabs[$kdsStepperCtrl.focusIndex].id}}" ' +
              'ng-focus="$kdsStepperCtrl.redirectFocus()" ' +
              'ng-class="{ ' +
                  '\'md-paginated\': $kdsStepperCtrl.shouldPaginate, ' +
                  '\'md-center-tabs\': $kdsStepperCtrl.shouldCenterTabs ' +
              '}" ' +
              'ng-keydown="$kdsStepperCtrl.keydown($event)" ' +
              'role="tablist"> ' +
            '<md-pagination-wrapper ' +
                'ng-class="{ \'md-center-tabs\': $kdsStepperCtrl.shouldCenterTabs }" ' +
                'md-tab-scroll="$kdsStepperCtrl.scroll($event)"> ' +
              '<md-tab-item ' +
                  'tabindex="-1" ' +
                  'class="md-tab" ' +
                  'ng-repeat="tab in $kdsStepperCtrl.tabs" ' +
                  'role="tab" ' +
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
                  'md-tabs-template="::tab.label" ' +
                  'md-scope="::tab.parent"></md-tab-item> ' +
              '<md-ink-bar></md-ink-bar> ' +
            '</md-pagination-wrapper> ' +
            '<div class="md-visually-hidden md-dummy-wrapper"> ' +
              '<md-dummy-tab ' +
                  'class="md-tab" ' +
                  'tabindex="-1" ' +
                  'id="tab-item-{{::tab.id}}" ' +
                  'role="tab" ' +
                  'aria-controls="tab-content-{{::tab.id}}" ' +
                  'aria-selected="{{tab.isActive()}}" ' +
                  'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
                  'ng-focus="$kdsStepperCtrl.hasFocus = true" ' +
                  'ng-blur="$kdsStepperCtrl.hasFocus = false" ' +
                  'ng-repeat="tab in $kdsStepperCtrl.tabs" ' +
                  'md-tabs-template="::tab.label" ' +
                  'md-scope="::tab.parent"></md-dummy-tab> ' +
            '</div> ' +
          '</md-tabs-canvas> ' +
        '</md-tabs-wrapper> ' +
        '<md-tabs-content-wrapper ng-show="$kdsStepperCtrl.hasContent && $kdsStepperCtrl.selectedIndex >= 0"> ' +
          '<md-tab-content ' +
              'id="tab-content-{{::tab.id}}" ' +
              'role="tabpanel" ' +
              'aria-labelledby="tab-item-{{::tab.id}}" ' +
              'md-swipe-left="$kdsStepperCtrl.swipeContent && $kdsStepperCtrl.incrementIndex(1)" ' +
              'md-swipe-right="$kdsStepperCtrl.swipeContent && $kdsStepperCtrl.incrementIndex(-1)" ' +
              'ng-if="$kdsStepperCtrl.hasContent" ' +
              'ng-repeat="(index, tab) in $kdsStepperCtrl.tabs" ' +
              'ng-class="{ ' +
                '\'md-no-transition\': $kdsStepperCtrl.lastSelectedIndex == null, ' +
                '\'md-active\':        tab.isActive(), ' +
                '\'md-left\':          tab.isLeft(), ' +
                '\'md-right\':         tab.isRight(), ' +
                '\'md-no-scroll\':     $kdsStepperCtrl.dynamicHeight ' +
              '}"> ' +
            '<div ' +
                'md-tabs-template="::tab.template" ' +
                'md-connected-if="tab.isActive()" ' +
                'md-scope="::tab.parent" ' +
                'ng-if="$kdsStepperCtrl.enableDisconnect || tab.shouldRender()"></div> ' +
          '</md-tab-content> ' +
        '</md-tabs-content-wrapper>';
    },
    controller:       'KdsStepperController',
    controllerAs:     '$kdsStepperCtrl',
    bindToController: true
  };
}

angular
    .module('kds.stepper')
    .directive('mdTabsTemplate', MdTabsTemplate);

function MdTabsTemplate ($compile, $mdUtil) {
  return {
    restrict: 'A',
    link:     link,
    scope:    {
      template:     '=mdTabsTemplate',
      connected:    '=?mdConnectedIf',
      compileScope: '=mdScope'
    },
    require:  '^?mdTabs'
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
      scope.$watch('connected', function (value) { value === false ? disconnect() : reconnect(); });
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
MdTabsTemplate.$inject = ["$compile", "$mdUtil"];

})(window, window.angular);

angular
    .module('kds.stepper')
    .controller('KdsStepperController', KdsStepperController);

/**
 * ngInject
 */
function KdsStepperController ($scope, $element, $window, $mdConstant, $mdTabInkRipple,
                           $mdUtil, $animateCss, $attrs, $compile, $mdTheming) {
  // define private properties
  var ctrl      = this,
      locked    = false,
      elements  = getElements(),
      queue     = [],
      destroyed = false,
      loaded    = false;

  // define one-way bindings
  defineOneWayBinding('stretchTabs', handleStretchTabs);

  // define public properties with change handlers
  defineProperty('focusIndex', handleFocusIndexChange, ctrl.selectedIndex || 0);
  defineProperty('offsetLeft', handleOffsetChange, 0);
  defineProperty('hasContent', handleHasContent, false);
  defineProperty('maxTabWidth', handleMaxTabWidth, getMaxTabWidth());
  defineProperty('shouldPaginate', handleShouldPaginate, false);

  // define boolean attributes
  defineBooleanAttribute('noInkBar', handleInkBar);
  defineBooleanAttribute('dynamicHeight', handleDynamicHeight);
  defineBooleanAttribute('noPagination');
  defineBooleanAttribute('swipeContent');
  defineBooleanAttribute('noDisconnect');
  defineBooleanAttribute('autoselect');
  defineBooleanAttribute('centerTabs', handleCenterTabs, false);
  defineBooleanAttribute('enableDisconnect');

  // define public properties
  ctrl.scope             = $scope;
  ctrl.parent            = $scope.$parent;
  ctrl.tabs              = [];
  ctrl.lastSelectedIndex = null;
  ctrl.hasFocus          = false;
  ctrl.lastClick         = true;
  ctrl.shouldCenterTabs  = shouldCenterTabs();

  // define public methods
  ctrl.updatePagination   = $mdUtil.debounce(updatePagination, 100);
  ctrl.redirectFocus      = redirectFocus;
  ctrl.attachRipple       = attachRipple;
  ctrl.insertTab          = insertTab;
  ctrl.removeTab          = removeTab;
  ctrl.select             = select;
  ctrl.scroll             = scroll;
  ctrl.nextPage           = nextPage;
  ctrl.previousPage       = previousPage;
  ctrl.keydown            = keydown;
  ctrl.canPageForward     = canPageForward;
  ctrl.canPageBack        = canPageBack;
  ctrl.refreshIndex       = refreshIndex;
  ctrl.incrementIndex     = incrementIndex;
  ctrl.getTabElementIndex = getTabElementIndex;
  ctrl.updateInkBarStyles = $mdUtil.debounce(updateInkBarStyles, 100);
  ctrl.updateTabOrder     = $mdUtil.debounce(updateTabOrder, 100);

  init();

  /**
   * Perform initialization for the controller, setup events and watcher(s)
   */
  function init () {
    ctrl.selectedIndex = ctrl.selectedIndex || 0;
    compileTemplate();
    configureWatchers();
    bindEvents();
    $mdTheming($element);
    $mdUtil.nextTick(function () {
      updateHeightFromContent();
      adjustOffset();
      updateInkBarStyles();
      ctrl.tabs[ ctrl.selectedIndex ] && ctrl.tabs[ ctrl.selectedIndex ].scope.select();
      loaded = true;
      updatePagination();
    });
  }

  /**
   * Compiles the template provided by the user.  This is passed as an attribute from the tabs
   * directive's template function.
   */
  function compileTemplate () {
    var template = $attrs.$mdTabsTemplate,
        element  = angular.element(elements.data);
    element.html(template);
    $compile(element.contents())(ctrl.parent);
    delete $attrs.$mdTabsTemplate;
  }

  /**
   * Binds events used by the tabs component.
   */
  function bindEvents () {
    angular.element($window).on('resize', handleWindowResize);
    $scope.$on('$destroy', cleanup);
  }

  /**
   * Configure watcher(s) used by Tabs
   */
  function configureWatchers () {
    $scope.$watch('$mdTabsCtrl.selectedIndex', handleSelectedIndexChange);
  }

  /**
   * Creates a one-way binding manually rather than relying on Angular's isolated scope
   * @param key
   * @param handler
   */
  function defineOneWayBinding (key, handler) {
    var attr = $attrs.$normalize('md-' + key);
    if (handler) defineProperty(key, handler);
    $attrs.$observe(attr, function (newValue) { ctrl[ key ] = newValue; });
  }

  /**
   * Defines boolean attributes with default value set to true.  (ie. md-stretch-tabs with no value
   * will be treated as being truthy)
   * @param key
   * @param handler
   */
  function defineBooleanAttribute (key, handler) {
    var attr = $attrs.$normalize('md-' + key);
    if (handler) defineProperty(key, handler);
    if ($attrs.hasOwnProperty(attr)) updateValue($attrs[attr]);
    $attrs.$observe(attr, updateValue);
    function updateValue (newValue) {
      ctrl[ key ] = newValue !== 'false';
    }
  }

  /**
   * Remove any events defined by this controller
   */
  function cleanup () {
    destroyed = true;
    angular.element($window).off('resize', handleWindowResize);
  }

  // Change handlers

  /**
   * Toggles stretch tabs class and updates inkbar when tab stretching changes
   * @param stretchTabs
   */
  function handleStretchTabs (stretchTabs) {
    angular.element(elements.wrapper).toggleClass('md-stretch-tabs', shouldStretchTabs());
    updateInkBarStyles();
  }

  function handleCenterTabs (newValue) {
    ctrl.shouldCenterTabs = shouldCenterTabs();
  }

  function handleMaxTabWidth (newWidth, oldWidth) {
    if (newWidth !== oldWidth) {
      angular.forEach(elements.tabs, function(tab) {
        tab.style.maxWidth = newWidth + 'px';
      });
      $mdUtil.nextTick(ctrl.updateInkBarStyles);
    }
  }

  function handleShouldPaginate (newValue, oldValue) {
    if (newValue !== oldValue) {
      ctrl.maxTabWidth      = getMaxTabWidth();
      ctrl.shouldCenterTabs = shouldCenterTabs();
      $mdUtil.nextTick(function () {
        ctrl.maxTabWidth = getMaxTabWidth();
        adjustOffset(ctrl.selectedIndex);
      });
    }
  }

  /**
   * Add/remove the `md-no-tab-content` class depending on `ctrl.hasContent`
   * @param hasContent
   */
  function handleHasContent (hasContent) {
    $element[ hasContent ? 'removeClass' : 'addClass' ]('md-no-tab-content');
  }

  /**
   * Apply ctrl.offsetLeft to the paging element when it changes
   * @param left
   */
  function handleOffsetChange (left) {
    var newValue = ctrl.shouldCenterTabs ? '' : '-' + left + 'px';
    angular.element(elements.paging).css($mdConstant.CSS.TRANSFORM, 'translate3d(' + newValue + ', 0, 0)');
    $scope.$broadcast('$mdTabsPaginationChanged');
  }

  /**
   * Update the UI whenever `ctrl.focusIndex` is updated
   * @param newIndex
   * @param oldIndex
   */
  function handleFocusIndexChange (newIndex, oldIndex) {
    if (newIndex === oldIndex) return;
    if (!elements.tabs[ newIndex ]) return;
    adjustOffset();
    redirectFocus();
  }

  /**
   * Update the UI whenever the selected index changes. Calls user-defined select/deselect methods.
   * @param newValue
   * @param oldValue
   */
  function handleSelectedIndexChange (newValue, oldValue) {
    if (newValue === oldValue) return;

    ctrl.selectedIndex     = getNearestSafeIndex(newValue);
    ctrl.lastSelectedIndex = oldValue;
    ctrl.updateInkBarStyles();
    updateHeightFromContent();
    adjustOffset(newValue);
    $scope.$broadcast('$mdTabsChanged');
    ctrl.tabs[ oldValue ] && ctrl.tabs[ oldValue ].scope.deselect();
    ctrl.tabs[ newValue ] && ctrl.tabs[ newValue ].scope.select();
  }

  function getTabElementIndex(tabEl){
    var tabs = $element[0].getElementsByTagName('md-tab');
    return Array.prototype.indexOf.call(tabs, tabEl[0]);
  }

  /**
   * Queues up a call to `handleWindowResize` when a resize occurs while the tabs component is
   * hidden.
   */
  function handleResizeWhenVisible () {
    // if there is already a watcher waiting for resize, do nothing
    if (handleResizeWhenVisible.watcher) return;
    // otherwise, we will abuse the $watch function to check for visible
    handleResizeWhenVisible.watcher = $scope.$watch(function () {
      // since we are checking for DOM size, we use $mdUtil.nextTick() to wait for after the DOM updates
      $mdUtil.nextTick(function () {
        // if the watcher has already run (ie. multiple digests in one cycle), do nothing
        if (!handleResizeWhenVisible.watcher) return;

        if ($element.prop('offsetParent')) {
          handleResizeWhenVisible.watcher();
          handleResizeWhenVisible.watcher = null;

          handleWindowResize();
        }
      }, false);
    });
  }

  // Event handlers / actions

  /**
   * Handle user keyboard interactions
   * @param event
   */
  function keydown (event) {
    switch (event.keyCode) {
      case $mdConstant.KEY_CODE.LEFT_ARROW:
        event.preventDefault();
        incrementIndex(-1, true);
        break;
      case $mdConstant.KEY_CODE.RIGHT_ARROW:
        event.preventDefault();
        incrementIndex(1, true);
        break;
      case $mdConstant.KEY_CODE.SPACE:
      case $mdConstant.KEY_CODE.ENTER:
        event.preventDefault();
        if (!locked) ctrl.selectedIndex = ctrl.focusIndex;
        break;
    }
    ctrl.lastClick = false;
  }

  /**
   * Update the selected index and trigger a click event on the original `md-tab` element in order
   * to fire user-added click events.
   * @param index
   */
  function select (index) {
    if (!locked) ctrl.focusIndex = ctrl.selectedIndex = index;
    ctrl.lastClick = true;
    // nextTick is required to prevent errors in user-defined click events
    $mdUtil.nextTick(function () {
      ctrl.tabs[ index ].element.triggerHandler('click');
    }, false);
  }

  /**
   * When pagination is on, this makes sure the selected index is in view.
   * @param event
   */
  function scroll (event) {
    if (!ctrl.shouldPaginate) return;
    event.preventDefault();
    ctrl.offsetLeft = fixOffset(ctrl.offsetLeft - event.wheelDelta);
  }

  /**
   * Slides the tabs over approximately one page forward.
   */
  function nextPage () {
    var viewportWidth = elements.canvas.clientWidth,
        totalWidth    = viewportWidth + ctrl.offsetLeft,
        i, tab;
    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[ i ];
      if (tab.offsetLeft + tab.offsetWidth > totalWidth) break;
    }
    ctrl.offsetLeft = fixOffset(tab.offsetLeft);
  }

  /**
   * Slides the tabs over approximately one page backward.
   */
  function previousPage () {
    var i, tab;
    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[ i ];
      if (tab.offsetLeft + tab.offsetWidth >= ctrl.offsetLeft) break;
    }
    ctrl.offsetLeft = fixOffset(tab.offsetLeft + tab.offsetWidth - elements.canvas.clientWidth);
  }

  /**
   * Update size calculations when the window is resized.
   */
  function handleWindowResize () {
    ctrl.lastSelectedIndex = ctrl.selectedIndex;
    ctrl.offsetLeft        = fixOffset(ctrl.offsetLeft);
    $mdUtil.nextTick(function () {
      ctrl.updateInkBarStyles();
      updatePagination();
    });
  }

  function handleInkBar (hide) {
    angular.element(elements.inkBar).toggleClass('ng-hide', hide);
  }

  /**
   * Toggle dynamic height class when value changes
   * @param value
   */
  function handleDynamicHeight (value) {
    $element.toggleClass('md-dynamic-height', value);
  }

  /**
   * Remove a tab from the data and select the nearest valid tab.
   * @param tabData
   */
  function removeTab (tabData) {
    if (destroyed) return;
    var selectedIndex = ctrl.selectedIndex,
        tab           = ctrl.tabs.splice(tabData.getIndex(), 1)[ 0 ];
    refreshIndex();
    // when removing a tab, if the selected index did not change, we have to manually trigger the
    //   tab select/deselect events
    if (ctrl.selectedIndex === selectedIndex) {
      tab.scope.deselect();
      ctrl.tabs[ ctrl.selectedIndex ] && ctrl.tabs[ ctrl.selectedIndex ].scope.select();
    }
    $mdUtil.nextTick(function () {
      updatePagination();
      ctrl.offsetLeft = fixOffset(ctrl.offsetLeft);
    });
  }

  /**
   * Create an entry in the tabs array for a new tab at the specified index.
   * @param tabData
   * @param index
   * @returns {*}
   */
  function insertTab (tabData, index) {
    var hasLoaded = loaded;
    var proto     = {
          getIndex:     function () { return ctrl.tabs.indexOf(tab); },
          isActive:     function () { return this.getIndex() === ctrl.selectedIndex; },
          isLeft:       function () { return this.getIndex() < ctrl.selectedIndex; },
          isRight:      function () { return this.getIndex() > ctrl.selectedIndex; },
          shouldRender: function () { return !ctrl.noDisconnect || this.isActive(); },
          hasFocus:     function () {
            return !ctrl.lastClick
                && ctrl.hasFocus && this.getIndex() === ctrl.focusIndex;
          },
          id:           $mdUtil.nextUid()
        },
        tab       = angular.extend(proto, tabData);
    if (angular.isDefined(index)) {
      ctrl.tabs.splice(index, 0, tab);
    } else {
      ctrl.tabs.push(tab);
    }
    processQueue();
    updateHasContent();
    $mdUtil.nextTick(function () {
      updatePagination();
      // if autoselect is enabled, select the newly added tab
      if (hasLoaded && ctrl.autoselect) $mdUtil.nextTick(function () {
        $mdUtil.nextTick(function () { select(ctrl.tabs.indexOf(tab)); });
      });
    });
    return tab;
  }

  // Getter methods

  /**
   * Gathers references to all of the DOM elements used by this controller.
   * @returns {{}}
   */
  function getElements () {
    var elements = {};

    // gather tab bar elements
    elements.wrapper = $element[ 0 ].getElementsByTagName('md-tabs-wrapper')[ 0 ];
    elements.data    = $element[ 0 ].getElementsByTagName('md-tab-data')[ 0 ];
    elements.canvas  = elements.wrapper.getElementsByTagName('md-tabs-canvas')[ 0 ];
    elements.paging  = elements.canvas.getElementsByTagName('md-pagination-wrapper')[ 0 ];
    elements.tabs    = elements.paging.getElementsByTagName('md-tab-item');
    elements.dummies = elements.canvas.getElementsByTagName('md-dummy-tab');
    elements.inkBar  = elements.paging.getElementsByTagName('md-ink-bar')[ 0 ];

    // gather tab content elements
    elements.contentsWrapper = $element[ 0 ].getElementsByTagName('md-tabs-content-wrapper')[ 0 ];
    elements.contents        = elements.contentsWrapper.getElementsByTagName('md-tab-content');

    return elements;
  }

  /**
   * Determines whether or not the left pagination arrow should be enabled.
   * @returns {boolean}
   */
  function canPageBack () {
    return ctrl.offsetLeft > 0;
  }

  /**
   * Determines whether or not the right pagination arrow should be enabled.
   * @returns {*|boolean}
   */
  function canPageForward () {
    var lastTab = elements.tabs[ elements.tabs.length - 1 ];
    return lastTab && lastTab.offsetLeft + lastTab.offsetWidth > elements.canvas.clientWidth +
        ctrl.offsetLeft;
  }

  /**
   * Determines if the UI should stretch the tabs to fill the available space.
   * @returns {*}
   */
  function shouldStretchTabs () {
    switch (ctrl.stretchTabs) {
      case 'always':
        return true;
      case 'never':
        return false;
      default:
        return !ctrl.shouldPaginate
            && $window.matchMedia('(max-width: 600px)').matches;
    }
  }

  /**
   * Determines if the tabs should appear centered.
   * @returns {string|boolean}
   */
  function shouldCenterTabs () {
    return ctrl.centerTabs && !ctrl.shouldPaginate;
  }

  /**
   * Determines if pagination is necessary to display the tabs within the available space.
   * @returns {boolean}
   */
  function shouldPaginate () {
    if (ctrl.noPagination || !loaded) return false;
    var canvasWidth = $element.prop('clientWidth');
    angular.forEach(getElements().dummies, function (tab) { canvasWidth -= tab.offsetWidth; });
    return canvasWidth < 0;
  }

  /**
   * Finds the nearest tab index that is available.  This is primarily used for when the active
   * tab is removed.
   * @param newIndex
   * @returns {*}
   */
  function getNearestSafeIndex (newIndex) {
    if (newIndex === -1) return -1;
    var maxOffset = Math.max(ctrl.tabs.length - newIndex, newIndex),
        i, tab;
    for (i = 0; i <= maxOffset; i++) {
      tab = ctrl.tabs[ newIndex + i ];
      if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
      tab = ctrl.tabs[ newIndex - i ];
      if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
    }
    return newIndex;
  }

  // Utility methods

  /**
   * Defines a property using a getter and setter in order to trigger a change handler without
   * using `$watch` to observe changes.
   * @param key
   * @param handler
   * @param value
   */
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler && handler(newValue, oldValue);
      }
    });
  }

  /**
   * Updates whether or not pagination should be displayed.
   */
  function updatePagination () {
    if (!shouldStretchTabs()) updatePagingWidth();
    ctrl.maxTabWidth = getMaxTabWidth();
    ctrl.shouldPaginate = shouldPaginate();
  }

  function updatePagingWidth() {
    var width = 1;
    angular.forEach(getElements().dummies, function (element) {
      //-- Uses the larger value between `getBoundingClientRect().width` and `offsetWidth`.  This
      //   prevents `offsetWidth` value from being rounded down and causing wrapping issues, but
      //   also handles scenarios where `getBoundingClientRect()` is inaccurate (ie. tabs inside
      //   of a dialog)
      width += Math.max(element.offsetWidth, element.getBoundingClientRect().width);
    });
    angular.element(elements.paging).css('width', Math.ceil(width) + 'px');
  }

  function getMaxTabWidth () {
    return $element.prop('clientWidth');
  }

  /**
   * Re-orders the tabs and updates the selected and focus indexes to their new positions.
   * This is triggered by `tabDirective.js` when the user's tabs have been re-ordered.
   */
  function updateTabOrder () {
    var selectedItem   = ctrl.tabs[ ctrl.selectedIndex ],
        focusItem      = ctrl.tabs[ ctrl.focusIndex ];
    ctrl.tabs          = ctrl.tabs.sort(function (a, b) {
      return a.index - b.index;
    });
    ctrl.selectedIndex = ctrl.tabs.indexOf(selectedItem);
    ctrl.focusIndex    = ctrl.tabs.indexOf(focusItem);
  }

  /**
   * This moves the selected or focus index left or right.  This is used by the keydown handler.
   * @param inc
   */
  function incrementIndex (inc, focus) {
    var newIndex,
        key   = focus ? 'focusIndex' : 'selectedIndex',
        index = ctrl[ key ];
    for (newIndex = index + inc;
         ctrl.tabs[ newIndex ] && ctrl.tabs[ newIndex ].scope.disabled;
         newIndex += inc) {}
    if (ctrl.tabs[ newIndex ]) {
      ctrl[ key ] = newIndex;
    }
  }

  /**
   * This is used to forward focus to dummy elements.  This method is necessary to avoid animation
   * issues when attempting to focus an item that is out of view.
   */
  function redirectFocus () {
    getElements().dummies[ ctrl.focusIndex ].focus();
  }

  /**
   * Forces the pagination to move the focused tab into view.
   */
  function adjustOffset (index) {
    if (index == null) index = ctrl.focusIndex;
    if (!elements.tabs[ index ]) return;
    if (ctrl.shouldCenterTabs) return;
    var tab         = elements.tabs[ index ],
        left        = tab.offsetLeft,
        right       = tab.offsetWidth + left;
    ctrl.offsetLeft = Math.max(ctrl.offsetLeft, fixOffset(right - elements.canvas.clientWidth + 32 * 2));
    ctrl.offsetLeft = Math.min(ctrl.offsetLeft, fixOffset(left));
  }

  /**
   * Iterates through all queued functions and clears the queue.  This is used for functions that
   * are called before the UI is ready, such as size calculations.
   */
  function processQueue () {
    queue.forEach(function (func) { $mdUtil.nextTick(func); });
    queue = [];
  }

  /**
   * Determines if the tab content area is needed.
   */
  function updateHasContent () {
    var hasContent  = false;
    angular.forEach(ctrl.tabs, function (tab) {
      if (tab.template) hasContent = true;
    });
    ctrl.hasContent = hasContent;
  }

  /**
   * Moves the indexes to their nearest valid values.
   */
  function refreshIndex () {
    ctrl.selectedIndex = getNearestSafeIndex(ctrl.selectedIndex);
    ctrl.focusIndex    = getNearestSafeIndex(ctrl.focusIndex);
  }

  /**
   * Calculates the content height of the current tab.
   * @returns {*}
   */
  function updateHeightFromContent () {
    if (!ctrl.dynamicHeight) return $element.css('height', '');
    if (!ctrl.tabs.length) return queue.push(updateHeightFromContent);

    var tabContent    = elements.contents[ ctrl.selectedIndex ],
        contentHeight = tabContent ? tabContent.offsetHeight : 0,
        tabsHeight    = elements.wrapper.offsetHeight,
        newHeight     = contentHeight + tabsHeight,
        currentHeight = $element.prop('clientHeight');

    if (currentHeight === newHeight) return;

    // Adjusts calculations for when the buttons are bottom-aligned since this relies on absolute
    // positioning.  This should probably be cleaned up if a cleaner solution is possible.
    if ($element.attr('md-align-tabs') === 'bottom') {
      currentHeight -= tabsHeight;
      newHeight -= tabsHeight;
      // Need to include bottom border in these calculations
      if ($element.attr('md-border-bottom') !== undefined) ++currentHeight;
    }

    // Lock during animation so the user can't change tabs
    locked = true;

    var fromHeight = { height: currentHeight + 'px' },
        toHeight = { height: newHeight + 'px' };

    // Set the height to the current, specific pixel height to fix a bug on iOS where the height
    // first animates to 0, then back to the proper height causing a visual glitch
    $element.css(fromHeight);

    // Animate the height from the old to the new
    $animateCss($element, {
      from: fromHeight,
      to: toHeight,
      easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
      duration: 0.5
    }).start().done(function () {
      // Then (to fix the same iOS issue as above), disable transitions and remove the specific
      // pixel height so the height can size with browser width/content changes, etc.
      $element.css({
        transition: 'none',
        height: ''
      });

      // In the next tick, re-allow transitions (if we do it all at once, $element.css is "smart"
      // enough to batch it for us instead of doing it immediately, which undoes the original
      // transition: none)
      $mdUtil.nextTick(function() {
        $element.css('transition', '');
      });

      // And unlock so tab changes can occur
      locked = false;
    });
  }

  /**
   * Repositions the ink bar to the selected tab.
   * @returns {*}
   */
  function updateInkBarStyles () {
    if (!elements.tabs[ ctrl.selectedIndex ]) {
      angular.element(elements.inkBar).css({ left: 'auto', right: 'auto' });
      return;
    }
    if (!ctrl.tabs.length) return queue.push(ctrl.updateInkBarStyles);
    // if the element is not visible, we will not be able to calculate sizes until it is
    // we should treat that as a resize event rather than just updating the ink bar
    if (!$element.prop('offsetParent')) return handleResizeWhenVisible();
    var index      = ctrl.selectedIndex,
        totalWidth = elements.paging.offsetWidth,
        tab        = elements.tabs[ index ],
        left       = tab.offsetLeft,
        right      = totalWidth - left - tab.offsetWidth,
        tabWidth;
    if (ctrl.shouldCenterTabs) {
      tabWidth = Array.prototype.slice.call(elements.tabs).reduce(function (value, element) {
        return value + element.offsetWidth;
      }, 0);
      if (totalWidth > tabWidth) $mdUtil.nextTick(updateInkBarStyles, false);
    }
    updateInkBarClassName();
    angular.element(elements.inkBar).css({ left: left + 'px', right: right + 'px' });
  }

  /**
   * Adds left/right classes so that the ink bar will animate properly.
   */
  function updateInkBarClassName () {
    var newIndex = ctrl.selectedIndex,
        oldIndex = ctrl.lastSelectedIndex,
        ink      = angular.element(elements.inkBar);
    if (!angular.isNumber(oldIndex)) return;
    ink
        .toggleClass('md-left', newIndex < oldIndex)
        .toggleClass('md-right', newIndex > oldIndex);
  }

  /**
   * Takes an offset value and makes sure that it is within the min/max allowed values.
   * @param value
   * @returns {*}
   */
  function fixOffset (value) {
    if (!elements.tabs.length || !ctrl.shouldPaginate) return 0;
    var lastTab    = elements.tabs[ elements.tabs.length - 1 ],
        totalWidth = lastTab.offsetLeft + lastTab.offsetWidth;
    value          = Math.max(0, value);
    value          = Math.min(totalWidth - elements.canvas.clientWidth, value);
    return value;
  }

  /**
   * Attaches a ripple to the tab item element.
   * @param scope
   * @param element
   */
  function attachRipple (scope, element) {
    var options = { colorElement: angular.element(elements.inkBar) };
    $mdTabInkRipple.attach(scope, element, options);
  }
}
KdsStepperController.$inject = ["$scope", "$element", "$window", "$mdConstant", "$mdTabInkRipple", "$mdUtil", "$animateCss", "$attrs", "$compile", "$mdTheming"];

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