(function () {
    'use strict';

    angular.module('App', [
        'ngRoute',
        'ngSanitize',
        'ui.tinymce'
    ]).config(AppConfig).run(AppRun);

    AppConfig.$inject = ['$routeProvider', '$locationProvider'];

    function AppConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/view/home.html',
                controller: 'HomeController'
            })
            .when('/about', {
                templateUrl: '/view/about.html',
                controller: 'AboutController'
            })
            .when('/login', {
                templateUrl: '/view/login.html',
                controller: 'LoginController'
            })
            .when('/control-panel', {
                templateUrl: '/view/control-panel.html',
                controller: 'ControlPanelController',
                resolve: {
                    auth: function (AuthenticationFactory) {
                        return AuthenticationFactory.isAuthenticated();
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }

    AppRun.$inject = ['$rootScope', '$location'];

    function AppRun($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
            if (eventObj.status === 401) {
                $location.path("/login");
            }
        });
    }
})();
