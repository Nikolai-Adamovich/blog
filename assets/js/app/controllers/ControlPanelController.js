(function () {
    'use strict';

    angular.module('App')
        .controller('ControlPanelController', ControlPanelController);

    ControlPanelController.$inject = ['$scope', '$compile', '$http', '$q', 'CurrentPageValue', 'CurrentUserFactory', 'MessageFactory'];

    function ControlPanelController($scope, $compile, $http, $q, CurrentPageValue, CurrentUserFactory, MessageFactory) {
        CurrentPageValue.value = 'Control';
        $scope.setTitle();

        $http.get('/Post').then(function (res) {
            $scope.posts = res.data;
        });
        $scope.addPost = function (header, article) {
            if (!header || !article) {
                MessageFactory.drawAlert('error', 'Fill in all the fields.');
                return;
            }
            $http.post('/User/addPost', {author: CurrentUserFactory.username, header: header, article: article}).then(function (res) {
                $scope.clearEditor();
                $scope.posts.push({author: res.data.author, header: res.data.header, article: res.data.article, createdAt: res.data.createdAt, updatedAt: res.data.updatedAt, id: res.data.id});
                MessageFactory.drawAlert('success', 'Article has been added successfully.');
            });

        };
        $scope.removePost = function (post, $index) {
            MessageFactory.drawConfirmDialog('Delete?').then(function (isConfirmed) {
                if (isConfirmed) {
                    $scope.posts.splice(length - 1 - $index, 1);
                    $http.delete('/Post/' + post.id).then(function () {
                        MessageFactory.drawAlert('success', 'Article has been removed successfully.');
                    });
                }
            });
        };
        $scope.changeMainInfo = function (pTitle, hTitle) {
            pTitle = pTitle || $scope.mainInfo.pageTitle;
            hTitle = hTitle || $scope.mainInfo.headerTitle;
            $http.post('/MainInfo/change', {pageTitle: pTitle, headerTitle: hTitle}).then(function () {
                $scope.mainInfo.pageTitle = pTitle;
                $scope.mainInfo.headerTitle = hTitle;
                $scope.setTitle(CurrentPageValue.value);
                $scope.pTitle = '';
                $scope.hTitle = '';
                MessageFactory.drawAlert('success', 'Main information has been changed successfully.');
            });
        };

        $scope.tinymceOptions = {
            plugins : 'advlist autolink autoresize charmap image imagetools link lists textcolor anchor hr media table',
            menubar: '',
            toolbar: ['formatselect forecolor anchor hr table link image media charmap blockquote  undo redo',
                'bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent superscript subscript'],
            autoresize_bottom_margin: 0,
            resize: false,
            file_browser_callback: function(field_name, url, type, win) {
                $scope.chooseFile().then(function (file) {
                    $scope.getImage(file).then(function (image) {
                        win.document.getElementById(field_name).value = image;
                    })
                });
            }
        };
        $scope.chooseFile = function () {
            document.querySelector('#file').click();
            var deferred = $q.defer();
            document.querySelector('#file').addEventListener('change', function (e) {
                deferred.resolve(e.target.files[0]);
            });
            return deferred.promise;
        };
        $scope.getImage = function (file) {
            console.log('getImage', file);
            var deferred = $q.defer(),
                fileReader = new FileReader();
            fileReader.addEventListener('load', function (e) {
                deferred.resolve(e.target.result);
            });
            fileReader.readAsDataURL(file);
            return deferred.promise;
        };
        $scope.drawEditor = function () {
            if (document.querySelector('.editor')) {
                $scope.closeEditor();
            }
            var editor = angular.element(
                '<div class="editor">' +
                    '<div class="wrapper">' +
                        '<input type="file" id="file" style="display: none">' +
                        '<input class="input" type="text" ng-model="header" placeholder="Article\'s header">' +
                        '<textarea ui-tinymce="tinymceOptions" ng-model="tinymceModel"></textarea>' +
                        '<div class="buttons">' +
                            '<button class="button" ng-click="addPost(header, tinymceModel)" title="Save"><i class="fa fa-floppy-o"></i></button>' +
                            '<button class="button" ng-click="clearEditor()" title="Clear"><i class="fa fa-eraser"></i></button>' +
                            '<button class="button" ng-click="closeEditor()" title="Close"><i class="fa fa-close"></i></button>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            angular.element(document.body).append($compile(editor)($scope));
        };
        $scope.clearEditor = function () {
            $scope.header = '';
            $scope.tinymceModel = '';
        };
        $scope.closeEditor = function () {
            angular.element(document.querySelector('.editor')).remove();
        };
    }
})();
