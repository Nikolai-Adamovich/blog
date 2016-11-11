(function () {
    'use strict';

    angular.module('App')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$http', 'CurrentPageValue'];

    function HomeController($scope, $http, CurrentPageValue) {
        CurrentPageValue.value = 'Home';
        $scope.setTitle();
        $http.get('/Post').then(function (res) {
            $scope.posts = res.data;
        });
    }
})();
