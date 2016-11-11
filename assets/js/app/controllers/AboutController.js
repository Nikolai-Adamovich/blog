(function () {
    'use strict';

    angular.module('App')
        .controller('AboutController', AboutController);

    AboutController.$inject = ['$scope', '$http', 'CurrentPageValue'];

    function AboutController($scope, $http, CurrentPageValue) {
        CurrentPageValue.value = 'About';
        $scope.setTitle();
        $http.get('/About/1').then(function (res) {
            $scope.page = res.data.page;
        });
    }
})();
