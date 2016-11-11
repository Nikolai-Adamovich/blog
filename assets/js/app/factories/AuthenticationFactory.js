(function () {
    'use strict';

    angular.module('App')
        .factory('AuthenticationFactory', AuthenticationFactory);

    AuthenticationFactory.$inject = ['$q', '$http', '$window', '$location', 'CurrentUserFactory', 'MessageFactory'];

    function AuthenticationFactory($q, $http, $window, $location, CurrentUserFactory, MessageFactory) {
        return {
            isAuthenticated: function () {
                var deferred = $q.defer();
                var currentUser = $window.sessionStorage.getItem('currentUser');
                if (currentUser) {
                    deferred.resolve(JSON.parse(currentUser));
                } else {
                    $http.post('/User/isAuthenticated').then(function (res) {
                        $window.sessionStorage.setItem('currentUser', JSON.stringify({
                            username: res.data.username,
                            email: res.data.email,
                            createdAt: res.data.createdAt,
                            id: res.data.id
                        }));
                        deferred.resolve(res.data);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }
                return deferred.promise;
            },
            login: function (username, password) {
                $http.post('User/login', {username: username, password: password}).then(function (res) {
                    CurrentUserFactory.username = res.data.username;
                    CurrentUserFactory.email = res.data.email;
                    CurrentUserFactory.createdAt = res.data.createdAt;
                    CurrentUserFactory.id = res.data.id;
                    $window.sessionStorage.setItem('currentUser', JSON.stringify({
                        username: res.data.username,
                        email: res.data.email,
                        createdAt: res.data.createdAt,
                        id: res.data.id
                    }));
                    MessageFactory.drawAlert('default', 'Welcome, ' + res.data.username + '.');
                    $location.path('/control-panel');
                }, function (err) {
                    MessageFactory.drawAlert('error', err.data.message);
                });
            },
            logout: function () {
                $http.post('User/logout', {username: CurrentUserFactory.username}).then(function (res) {
                    if ($location.path() === '/control-panel') {
                        $location.path('/login');
                    }
                    CurrentUserFactory.username = '';
                    CurrentUserFactory.email = '';
                    CurrentUserFactory.createdAt = '';
                    CurrentUserFactory.id = '';
                    $window.sessionStorage.removeItem('currentUser');
                    MessageFactory.drawAlert('default', res.data.message);
                }, function (err) {
                    MessageFactory.drawAlert('error', err.data.message);
                });
            },
            register: function (username, email, password) {
                $http.post('/User/createUser', {username: username, email: email, password: password}).then(function (res) {
                    MessageFactory.drawAlert('success', 'User "' + res.data.username + '" has been registered successfully.');
                }, function (err) {
                    MessageFactory.drawAlert('error', err.data.message);
                });

            }
        }
    }
})();
