import angular from 'angular';
import 'angular-ui-router';

import appConfig from './config/app.config';
import appRun from './config/app.run';
import appConst from './config/app.constant';


import './home';
import './config/app.templates';
import './common';

let required = [
  'ui.router',
  'app.home',
  'app.common'
]

window.app = angular.module('app', required);

angular.module('app').constant('AppConstants', appConst);

angular.module('app').config(appConfig);

angular.module('app').run(appRun);
angular.bootstrap(document, ['app'], {
  strictDi: true
});
