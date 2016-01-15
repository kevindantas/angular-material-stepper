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