function HomeConfig($stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('home', {
            url: '/home',
            //abstract: true,
            views: {
                mainview: {
                    template: '<home-component class="fully-occupy initial-style-abs" ></home-component>'
                }
            },
            resolve: {
                profileDetail: function ($http, $timeout) {
                    return $http.get('detail.json')
                            .success((reponse)=>{
                                console.info(reponse);
                                return reponse;
                            });
                }
            }
        });
}
export default HomeConfig;