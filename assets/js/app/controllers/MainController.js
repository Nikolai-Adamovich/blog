(function () {
    'use strict';

    angular.module('App')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$http', '$sce', 'CurrentPageValue', 'AuthenticationFactory', 'CurrentUserFactory'];

    function MainController($scope, $http, $sce, CurrentPageValue, AuthenticationFactory, CurrentUserFactory) {
        $scope.currentUser = CurrentUserFactory;
        $scope.logout = AuthenticationFactory.logout;

        AuthenticationFactory.isAuthenticated().then(function (res) {
            CurrentUserFactory.username = res.username;
            CurrentUserFactory.email = res.email;
            CurrentUserFactory.createdAt = res.createdAt;
            CurrentUserFactory.id = res.id;
        }, function () {
            CurrentUserFactory.username = '';
            CurrentUserFactory.email = '';
            CurrentUserFactory.createdAt = '';
            CurrentUserFactory.id = '';
        });

        $scope.mainInfo = {};
        $http.get('/MainInfo/1').then(function (res) {
            $scope.mainInfo = res.data;
            $scope.setTitle(CurrentPageValue.value);
        });

        $scope.setTitle = function () {
            $scope.pageTitle = $scope.mainInfo.pageTitle + ' - ' + CurrentPageValue.value;
        };

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.emailFormat = /^([a-z0-9]+([\-\.]{1,1}[a-z0-9]+)*)+@([a-z0-9]+([\-\.]{1,1}[a-z0-9]+)*)+\.[a-z]{2,}$/;
    }
})();
