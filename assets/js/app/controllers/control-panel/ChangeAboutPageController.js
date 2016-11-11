(function () {
    'use strict';

    angular.module('App')
        .controller('ChangeAboutPageController', ChangeAboutPageController);

    ChangeAboutPageController.$inject = ['$scope', '$http'];

    function ChangeAboutPageController($scope, $http) {
        $http.get('/About/1').then(function (res) {
            $scope.page = res.data.page;
            /*$scope.drawEditor();*/
        });
    }
})();
