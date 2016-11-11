(function () {
    'use strict';

    angular.module('App')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$scope', '$http'];

    function UsersController($scope, $http) {
        $http.get('/User').then(function (res) {
            $scope.users = res.data;
        });
        $http.get('/User/getCount').then(function (res) {
            console.log(res.data.count);
        });
    }
})();
