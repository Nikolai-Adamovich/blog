(function () {
    'use strict';

    angular.module('App')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'CurrentPageValue', 'AuthenticationFactory'];

    function LoginController($scope, CurrentPageValue, AuthenticationFactory) {
        CurrentPageValue.value = 'Login';
        $scope.setTitle();

        $scope.login = AuthenticationFactory.login;
        $scope.register = AuthenticationFactory.register;

        $scope.clear = function () {
            $scope.username = '';
            $scope.email  = '';
            $scope.password = '';
            $scope.password2 = '';
        };
    }
})();
