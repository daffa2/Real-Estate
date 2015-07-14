(function () {
    'use strict';
    angular.module('realEstateApp', ['ipCookie', 'naif.base64'])
        //        .value('serverLocation', 'http://localhost:65035/api/'); dotnet
        .value('serverLocation', 'http://localhost:8080/');
})()
