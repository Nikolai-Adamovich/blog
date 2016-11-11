(function () {
    'use strict';

    angular.module('App')
        .factory('CurrentUserFactory', CurrentUserFactory);

    CurrentUserFactory.$inject = [];

    function CurrentUserFactory() {
        return {};
    }
})();
