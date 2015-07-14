(function () {
    'use strict';
    var SendInfoCtrl = function ($scope, $location, CustInfoService) {
        $scope.estateOptions = ['Apartment', 'House', 'Doplex'];
        $scope.custInfo = {
            FullName: "",
            LookingFor: $scope.estateOptions[0],
            Email: "",
            Phone: ""
        };
        $scope.lookingFor = {
            Any: 0,
            Duplex: 1,
            House: 2,
            Apartment: 3
        };

        $scope.custInfoService = new CustInfoService.custInfoService();

        $scope.ClickedOnSendInfo = function () {
            $scope.custToSend = {};
            angular.copy($scope.custInfo, $scope.custToSend);
            $scope.custToSend.LookingFor = $scope.lookingFor[$scope.custInfo.LookingFor];
            console.log($scope.custToSend);
            $scope.custInfoService.SendCustToServer($scope.custInfo);
        };
    };

    angular.module('realEstateApp').controller('SendInfoCtrl', ['$scope', '$location', 'CustInfoService', SendInfoCtrl]);

    var HomeCtrl = function ($scope, $location) {
        $scope.ClickedOnViewNewApartments = function () {
            //            $location.url("../ForSale.html");
        };
    };

    angular.module('realEstateApp').controller('HomeCtrl', ['$scope', '$location', HomeCtrl]);

    var ForSaleCtrl = function ($scope, ipCookie, ServerService) {
        $scope.estates = [];
        //            [{
        //            RoomNumber: 2,
        //            Address: "Hahalil",
        //            EstateType: "0",
        //            Details: "Very impressive",
        //            Status: 1,
        //            Agent: null,
        //            DirName: "Herzel",
        //            Images: ["../Images/herzel.jpg"]
        //        }];

        $scope.cities = ["Any", "Petah-Tikva", "Hod-Hasharon"];
        $scope.lookingFor = ["Rent", "Sale", "Both"];
        $scope.properties = ["Any", "Duplex", "House", "Apartment"];
        $scope.roomsNum = ["Any", 1, 2, 3, 4, 5];

        $scope.ShowLoading = false;
        $scope.ShowMoreOptions = false;

        $scope.HomeSearchForm = {
            City: $scope.cities[0],
            Address: "",
            MinPrice: 0,
            MaxPrice: 3000000,
            MinArea: 0,
            MaxArea: 10000,
            PropertyType: $scope.properties[0],
            RoomsNumber: $scope.properties[0],
            FreeText: "",
            LookingFor: $scope.lookingFor[0]
        };

        $scope.ClickedOnSearch = function () {
            $scope.ShowLoading = true;
            console.log($scope.HomeSearchForm);
            if (!$scope.ShowMoreOptions) {
                ServerService.GetSpecificEstateWithLessOptions($scope.HomeSearchForm);
            }
        };

        $scope.ClickedOnMoreOptions = function () {
            $scope.ShowMoreOptions = !$scope.ShowMoreOptions;
        };

        $scope.$on('GotEstates', function (event, args) {
            console.log(event, args);
            if (args.IsSucceded) {
                $scope.estates = args.data;

                $scope.SaveEstatesToCookies($scope.estates);

                $scope.CheckIfGotResultsFromServer();
            } else {
                console.log("Error with connection to server");
            }
            $scope.ShowLoading = false;
        });

        $scope.SaveEstatesToCookies = function (estates) {
            var length = 5;
            estates.length > 5 ? length = 5 : length = estates.length

            var fiveEstates = [];
            for (var i = 0; i < length; i++) {
                fiveEstates.push(estates[i]);
            }
            ipCookie('estates', fiveEstates);
        };

        $scope.CheckIfGotResultsFromServer = function () {
            if ($scope.estates.length == 0) {
                $scope.ShowDidntFindResult = true;

                setTimeout(function () {
                    $scope.ShowDidntFindResult = false;
                    $scope.$apply();
                }, 3000);
            }

        }

        $scope.ClickedOnViewDetails = function (estate) {
            estate.Images = [];
            console.log(estate);
            ipCookie('estate', estate);

            var lctStr = location.toString();
            var index = lctStr.lastIndexOf('/');
            var lct = lctStr.substring(0, index + 1) + 'ShowProperty.html';

            location = lct;
        };
    }

    angular.module('realEstateApp').controller('ForSaleCtrl', ['$scope', 'ipCookie', 'ServerService', ForSaleCtrl]);

    var ShowPropCtrl = function ($scope, ipCookie, ServerService, GetTypeService) {
        $scope.estate = {},
            $scope.estates = {};

        if (ipCookie('estate') == undefined) {
            ipCookie('estate', $scope.estate);
        } else {
            $scope.estate = ipCookie('estate');
            $scope.estate.StatusStr = GetTypeService.getStatus($scope.estate.Status);
            $scope.estate.EstateTypeStr = GetTypeService.getOption($scope.estate.EstateType);
        }

        if (ipCookie('estates') == undefined) {
            ipCookie('estates', $scope.estates);
        } else {
            $scope.estates = ipCookie('estates');
        }

        ($scope.InitImages = function () {
            ServerService.GetSpecificImage($scope.estate.DirName, "Main");

            for (var i = 0; i < $scope.estates.length; i++) {
                ServerService.GetSpecificImage($scope.estates[i].DirName, i);
            }

        })();

        $scope.$on("GotSpecificImg", function (event, args) {
            if (args.IsSucceded) {
                if (args.index == "Main") {
                    $scope.estate.Images = args.img;

                    setTimeout(function () {
                        $('.carousel-indicator').first().addClass('active');
                        $('.moving-items').first().addClass('active');
                    }, 500)
                } else {
                    $scope.estates[args.index].Images = args.img;
                }
            } else {
                console.log(args.Msg);
            }
        });

        ($scope.InitAgent = function () {
            ServerService.GetAgent($scope.estate.AgentId);
        })();

        $scope.$on("GotAgent", function (event, args) {
            if (args.IsSucceded) {
                $scope.estate.Agent = args.agent;
            } else {
                console.log(args.Msg);
            }
        });

    };

    angular.module('realEstateApp').controller('ShowPropCtrl', ['$scope', 'ipCookie', 'ServerService', 'GetTypeService', ShowPropCtrl]);

    var UploadCtrl = function ($scope, ServerService, GetTypeService) {
        $scope.lookingFor = ["Rent", "Sale", "Both"];
        $scope.properties = ["Any", "Duplex", "House", "Apartment"];

        $scope.uploadEstate = {
            Price: 1000000,
            LookingFor: $scope.lookingFor[0],
            RoomsNumber: 4,
            Area: 1000,
            PropertyType: $scope.properties[0],
            Desc: ""
        };

        $scope.ClickedOnUpload = function () {
            //            $scope.initPhotos();
            console.log($scope.uploadEstate);
            ServerService.PostEstate($scope.uploadEstate);

        };

        $scope.SendPhotos = function (id) {
            if (typeof $scope.files != "undefined") {
                for (var i = 0; i < $scope.files.length; i++) {
                    ServerService.UploadPhotos({
                        base64: 'data:' + $scope.files[i].filetype + ';base64,' + $scope.files[i].base64,
                        _id: id
                    });
                }
            }
        };

        $scope.$on('postEstate', function (event, args) {
            $scope.SendPhotos(args._id);
        });
    };



    angular.module('realEstateApp').controller('UploadCtrl', ['$scope', 'ServerService', 'GetTypeService', UploadCtrl]);
})()
