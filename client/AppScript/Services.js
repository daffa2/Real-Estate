(function () {
    var CustInfoService = function ($http, serverLocation) {
        var custInfoService = function () {
            var self = this;
            //            console.log(self.globVarSer);
            self.SendCustToServer = function (customer) {
                console.log(serverLocation);
                $http.post(serverLocation + 'customer', customer).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };
        };
        return {
            custInfoService: custInfoService
        }
    };
    angular.module('realEstateApp').service('CustInfoService', ['$http', 'serverLocation', CustInfoService])

    var ServerService = function ($http, serverLocation, $rootScope) {
        var self = this;
        self.GetAllEstates = function () {
            $http.get(serverLocation + 'estate/123').
            success(
                function (data) {
                    data.map(function (item) {
                        $http.get(serverLocation + 'image?dirName=' + item.DirName)
                            .success(function (data) {
                                data.map(function (item) {
                                    item += "data:image/png;base64,";
                                });
                                item.Images = data;
                            });
                    });
                    $rootScope.$broadcast('GotEstates', {
                        data: data,
                        IsSucceded: true
                    })
                }
            ).error(function () {
                $rootScope.$broadcast('GotEstates', {
                    data: undefined,
                    IsSucceded: false
                })
            })
        };

        self.GetSpecificImage = function (dirName, index) {
            $http.get(serverLocation + 'image?dirName=' + dirName)
                .success(function (data) {
                    $rootScope.$broadcast('GotSpecificImg', {
                        index: index,
                        img: data,
                        IsSucceded: true
                    })
                }).error(function (err) {
                    $rootScope.$broadcast('GotSpecificImg', {
                        Msg: err,
                        IsSucceded: false
                    })
                });
        }

        self.GetAgent = function (agentId) {
            $http.get(serverLocation + 'agent/' + agentId)
                .success(function (data) {
                    $rootScope.$broadcast('GotAgent', {
                        agent: data,
                        IsSucceded: true
                    })
                }).error(function (err) {
                    $rootScope.$broadcast('GotAgent', {
                        Msg: err,
                        IsSucceded: false
                    })
                });
        }

        self.GetSpecificEstateWithLessOptions = function (options) {
            $http.get(serverLocation + 'SearchForEstates?city=' + options.City + '&minPrice=' +
                options.MinPrice + '&maxPrice=' + options.MaxPrice + '&lookingFor=' + options.LookingFor).
            success(
                function (data) {
                    data.map(function (item) {
                        $http.get(serverLocation + 'image?dirName=' + item.DirName)
                            .success(function (data) {
                                data.map(function (item) {
                                    item += "data:image/png;base64,";
                                });
                                item.Images = data;
                            });
                    });
                    $rootScope.$broadcast('GotEstates', {
                        data: data,
                        IsSucceded: true
                    })
                }
            ).error(function () {
                $rootScope.$broadcast('GotEstates', {
                    data: undefined,
                    IsSucceded: false
                })
            })
        };

        self.PostEstate = function (estate) {
            console.log(serverLocation + 'estate');
            console.log('sending estate', estate);
            $http.post(serverLocation + 'estate', estate)
                .success(function (data) {
                    console.log('successfully sent estate', data);
                    $rootScope.$broadcast('postEstate', {
                        IsSucceded: true,
                        _id: data
                    })
                }).error(function (err) {
                    $rootScope.$broadcast('postEstate', {
                        Msg: err,
                        IsSucceded: false
                    })
                });
        }

        self.UploadPhotos = function (photo) {
            console.log(serverLocation + 'uploadPhoto');
            console.log('sending photo', photo);
            $http.post(serverLocation + 'uploadPhoto', photo)
                .success(function (data) {
                    console.log('successfully sent photo', data);
                }).error(function (err) {
                    console.error('there was error with uploading the photo', err);
                });
        }
    }

    angular.module('realEstateApp').service('ServerService', ['$http', 'serverLocation', '$rootScope', ServerService]);

    var GetTypeService = function () {
        var self = this;

        self.estateStatus = ['Sale', 'Rent', 'Both'];
        self.estateOpt = ['Apartment', 'House', 'Pentahouse', 'Any'];

        self.getStatus = function (number) {
            return self.estateStatus[number];
        };

        self.getOption = function (number) {
            return self.estateOpt[number];
        };
    };

    angular.module('realEstateApp').service('GetTypeService', [GetTypeService]);
})()
