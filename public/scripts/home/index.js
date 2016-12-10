let homeModule =  angular.module('app.home', []);
//comment added by added
// Include our UI-Router config settings
import homeConfig from './home.config';
homeModule.config(homeConfig);

// Controllers
import HomeComponent from './home.component';
homeModule.component('homeComponent',HomeComponent);

export default homeModule;
