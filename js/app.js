var TestApp = angular.module('TestApp', ['ngRoute', 'ngResource']);

TestApp.config(
	
	function($routeProvider, $locationProvider)
	{
		$routeProvider
		.when('/', {
			templateUrl: 'templates/step1.html',
			controller: 'MainFormController'
		})
		.when('/#', {
			templateUrl: 'templates/step1.html',
			controller: 'MainFormController'
		})
		.when('/step1', {
			templateUrl: 'templates/step1.html',
			controller: 'MainFormController'
		})
		.when('/step2', {
			templateUrl: 'templates/step2.html',
			controller: 'MainFormController'
		})
		.otherwise({ redirectTo: '/step1' });
		
		$locationProvider.html5Mode(true);
	}
);

TestApp.filter('getDefaultCurrency', function()
{
	return function(input, isDefault)
	{
		var len = input.length;		
		for(var i = 0; i < len; i++)
		{
			if(input[i].selected == isDefault)
			{
				return input[i];
			}
		}
		
		return null;
	}
});

TestApp.controller('MainFormController', function($scope, $location, $filter, $http)
{
	//Base Model for an order object
	$scope.order = 
	{
		name : '',
		email : '',
		country : 1,
		companyName : '',
		companyDescription : '',
		currencyName : '',
		price: 0
	}
	
	$scope.packages = 
	[
		{id : 0, namePackage: "Lite", descriptionPackage: "A simplest package for beginers.", pricePackage: 100 },
		{id : 1, namePackage: "Standart", descriptionPackage: "Advanced package for advanced users.", pricePackage: 200 },
		{id : 2, namePackage: "Pro", descriptionPackage: "Feel our full services care with packages PRO, for real pro users.", pricePackage: 300 }
	];
	
	$scope.packageSelected = false;
	
	$scope.currencies = 
	[
		{ id: 0, nameCurrency: "USD", signCurrency: "$", rateCurrency: 1.0, selected: false },
		{ id: 1, nameCurrency: "EUR", signCurrency: "€", rateCurrency: 0.89, selected: false },
		{ id: 2, nameCurrency: "RUB", signCurrency: "руб.", rateCurrency: 67.9, selected: false },
		{ id: 3, nameCurrency: "UAH", signCurrency: "грн.", rateCurrency: 22.1, selected: true }
	];
	
	$scope.selectedCurrency;
	
	$scope.setDefaultCurrency = function()
	{	
		$scope.selectedCurrency = $filter('getDefaultCurrency')($scope.currencies, true);		
	}
	
	$scope.setDefaultCurrency();
	
	//console.log("Selected Currency: " + $scope.selectedCurrency.nameCurrency);
	
	$scope.currencyChange = function(currencyID)
	{
		$scope.selectedCurrency = $scope.currencies[currencyID];
		console.log("Selected: " + $scope.selectedCurrency.nameCurrency);
	}
	
	$scope.getPrice = function(packageData)
	{
		if(!angular.isUndefined(packageData) && !angular.isUndefined($scope.selectedCurrency.rateCurrency))
		{
			console.log(packageData + ", " + $scope.selectedCurrency.rateCurrency);
			return Math.floor( packageData.pricePackage * $scope.selectedCurrency.rateCurrency ) + " " + $scope.selectedCurrency.signCurrency;
		}
		else
		{
			return 0;
		}
	}
	
	$scope.LoadContriesList = function()
	{
		//Load Countries List
		$('select#countries-list').load('templates/countries.html');
	}
	
	$scope.LoadContriesList();
	
	$scope.localStorageGet = function()
	{
		var local = localStorage.getItem("localData");
		console.log("Local Storage: " + local);
		if(local == "undefined" || local == null)
		{
			console.log("Local Storage is Empty Now!");
			return;
		}
		else
		{
			$scope.order.length = 0;
			$scope.order = JSON.parse(local);
		}
		
		console.log("Updated order: " + $scope.order);
	}
	
	$scope.localStorageSet = function(order)
	{
		localStorage.clear();
		var stringData = JSON.stringify(order);
		localStorage.setItem("localData", stringData);
	}
	
	
	$scope.collectData = function(order)
	{		
		$scope.localStorageSet(order);
		$location.path('/step2');
	}
	
	$scope.addPackageData = function(packageData)
	{
		$scope.packageSelected = true;
		$scope.order.currencyName = $scope.selectedCurrency.nameCurrency;
		$scope.order.price = parseInt($scope.getPrice(packageData));
		
		console.log("Updated: " + JSON.stringify($scope.order));
	}
	
	$scope.showInputError = function(error)
	{
		if(error.required)
		{
			return "This field should not be empty!";
		}
		else if(error.email)
		{
			return "E-mail field should filled in properly format!";
		}
	}
	
	$scope.submitRequest = function()
	{
		console.log(JSON.stringify($scope.order));
		
		$http.post('/order/create/', $scope.order).then(
			function(response){
				console.log("Success!");
			},
			function(error){
				console.log("Error!");
			});
	}
	
	$scope.localStorageGet();
});