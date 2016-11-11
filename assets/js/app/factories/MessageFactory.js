(function () {
    'use strict';

    angular.module('App')
        .factory('MessageFactory', MessageFactory);

    MessageFactory.$inject = ['$q'];

    function MessageFactory($q) {
        return {
            drawAlert: function (type, message) {
                if (document.querySelector('.modal-background')) {
                    angular.element(document.querySelector('.modal-background')).remove();
                }
                if (Array.isArray(message)) {
                    message = message.join('<br>');
                }
                var alert = angular.element(
                    '<div class="modal-background">' +
                    '<div id="alert" class="modal-window">' +
                    '<p class="' + type + '">' + message + '</p>' +
                    '</div>' +
                    '</div>'
                );

                document.querySelector('.blur-container').classList.add('blur');
                angular.element(document.body).append(alert);

                setTimeout(function () {
                    alert.remove();
                    document.querySelector('.blur-container').classList.remove('blur');
                },3000);
            },
            drawConfirmDialog: function (message) {
                var confirmDialog = angular.element(
                    '<div class="modal-background">' +
                    '<div class="confirm-window">' +
                    '<p class="default">' + message + '</p>' +
                    '<div class="buttons">' +
                    '<button id="ok"><i class="fa fa-check"></i> OK</button>' +
                    '<button id="cancel"><i class="fa fa-close"></i> Cancel</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );
                angular.element(document.querySelector('body')).append(confirmDialog);

                var deferred = $q.defer();
                function confirm(e) {
                    confirmDialog.remove();
                    deferred.resolve(e.target.id === 'ok');
                }
                document.querySelector('#ok').addEventListener('click', confirm);
                document.querySelector('#cancel').addEventListener('click', confirm);
                return deferred.promise;
            }
        }
    }
})();
