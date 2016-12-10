let commonModule = angular.module('app.common', []);

import communicationFact from './common.communication';

commonModule.factory('communication', communicationFact.communicationFunctions);

export default commonModule;