/**
 * Created by NDS on 18/12/2015.
 */
//'use strict';
angular.module('kds.stepper', ['ngMaterial'])
  .config(function ($mdIconProvider) {
    $mdIconProvider.icon(iconDone.id, iconDone.url, 24);
    $mdIconProvider.icon(iconWarning.id, iconWarning.url, 24);
    $mdIconProvider.icon(iconError.id, iconError.url, 24);
  })
  .run(function ($http, $templateCache) {
    $templateCache.put(iconDone.url, iconDone.svg);
    $templateCache.put(iconWarning.url, iconWarning.svg);
    $templateCache.put(iconError.url, iconError.svg);
  });

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