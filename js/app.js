'use strict';

// Declare app level module which depends on filters, and services
var mainApp = angular.module('myApp', [
	'ngRoute',
	'firebase',
	'chart.js'
])

mainApp.constant('FBURL', 'https://dazzling-heat-2323.firebaseio.com/');
mainApp.constant('FBURL_Devices', 'https://dazzling-heat-2323.firebaseio.com/Devices/');
mainApp.constant('FBURL_Clients', 'https://dazzling-heat-2323.firebaseio.com/Clients/');
mainApp.constant('FBURL_DevicesLoaned', 'https://dazzling-heat-2323.firebaseio.com/DevicesLoaned/');
mainApp.constant('FBURL_ClientMoistureData', 'https://dazzling-heat-2323.firebaseio.com/ClientMoistureData/');
mainApp.constant('FBURL_Users', 'https://dazzling-heat-2323.firebaseio.com/users/');

mainApp.factory("Auth", ["$firebaseAuth","FBURL",
  function($firebaseAuth, FBURL) {
    var ref = new Firebase(FBURL);
    return $firebaseAuth(ref);
  }
]);

mainApp.factory("Root", ["FBURL",
  function(FBURL) {
    var ref = new Firebase(FBURL);
    return ref;
  }
]);

mainApp.factory("Devices", ["FBURL_Devices",
  function(FBURL_Devices) {
    var ref = new Firebase(FBURL_Devices);
    return ref;
  }
]);

mainApp.factory("Clients", ["FBURL_Clients",
  function(FBURL_Clients) {
    var ref = new Firebase(FBURL_Clients);
    return ref;
  }
]);

mainApp.factory("DevicesLoaned", ["FBURL_DevicesLoaned",
  function(FBURL_DevicesLoaned) {
    var ref = new Firebase(FBURL_DevicesLoaned);
    return ref;
  }
]);

mainApp.factory("ClientMoistureData", ["FBURL_ClientMoistureData",
  function(FBURL_ClientMoistureData) {
    var ref = new Firebase(FBURL_ClientMoistureData);
    return ref;
  }
]);

mainApp.factory("Users", ["FBURL_Users",
  function(FBURL_Users) {
    var ref = new Firebase(FBURL_Users);
    return ref;
  }
]);

mainApp.service('paginateService', function () {
	this.paged = function (valLists,pageSize) {
		if (valLists.length === 0) {
			return;
		} 
		var retVal = [];
		for (var i = 0; i < valLists.length; i++) {
				if (i % pageSize === 0) {
						retVal[Math.floor(i / pageSize)] = [valLists[i]];
				} else {
						retVal[Math.floor(i / pageSize)].push(valLists[i]);
				}
		}
		return retVal;
	};

	this.searched = function (valLists,toSearch) {
		return _.filter(valLists, 
		function (i) {
				/* Search Text in all 3 fields */
				return searchUtil(i, toSearch);
		});        
  };
	
	this.searchUtil = function (item, toSearch) {
    /* Search Text in all 3 fields */
    return (item.firstname.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.lastname.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
	}
});

mainApp.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

mainApp.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		// We can catch the error thrown when the $requireAuth promise is rejected
		// and redirect the user back to the home page
		
		if (error === "AUTH_REQUIRED") {
			$location.path("/loginUser");
		}
	});
}]);

mainApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/clients',  {
			templateUrl: 'pages/user_index.html', 
			controller: 'UserIndexCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$requireAuth();
				}]
			}
		})
		.when('/user/:id',  {
			templateUrl: 'pages/user.html', 
			controller: 'UserDetailCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$requireAuth();
				}]
			}
		})
		.when('/user/new',  {
			templateUrl: 'pages/user.html', 
			controller: 'UserDetailCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$requireAuth();
				}]
			}
		})
		.when('/devices',  {
			templateUrl: 'pages/devices_index.html', 
			controller: 'DeviceCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$requireAuth();
				}]
			}
		})
		.when('/loginUser',  {
			templateUrl: 'pages/login_index.html', 
			controller: 'AuthUserCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$waitForAuth();
				}]
			}
		})
		.when('/profile',  {
			templateUrl: 'pages/account/account.html', 
			controller: 'AcctCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$requireAuth();
				}]
			}
		})
		.when('/help',  {
			templateUrl: 'pages/help.html', 
			controller: 'HelpCtrl',
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
					// $waitForAuth returns a promise so the resolve waits for it to complete
					return Auth.$requireAuth();
				}]
			}
		})
		.otherwise({redirectTo: '/loginUser'});
}]);

mainApp.directive("clientsPaginatedTable", function() {
	return {
			restrict : "E",
			template : "<div class='over' name='table-responsive'><table class='table table-bordered table-striped display'><thead><tr><th class='id'></th><th class='firstname'>Firstname&nbsp;</th><th class='lastname'>Lastname&nbsp;</th><th class='actions'>Actions&nbsp;</th></tr></thead><tfoot><tr><td colspan='6'><div ><ul class='pagination pull-left'><li ng-class='{disabled: currentPage == 0}'><a href ng-click='prevPage()'>« Prev</a></li><li ng-repeat='n in range(pagedItems.length, currentPage, currentPage + gap)' ng-class='{active: n == currentPage}' ng-click='setPage()'><a href ng-bind='n + 1'>1</a></li><li ng-class='{disabled: (currentPage) == pagedItems.length }'><a href ng-click='nextPage(pagedItems.length)'>Next »</a></li></ul></div><div class='pagination pull-right'></div></td></tr><tr ng-show='!pagedItems.length'><td>&nbsp;<em>{{resultMsg}}</em></td></tr></tfoot><tbody><tr ng-repeat='item in pagedItems[currentPage]'><td width='10%'><a class='btn btn-danger btn-xs' ng-really-message='Are you sure you want to remove {{ item.firstname }} {{ item.lastname }}?' ng-really-click='removeItem()'><span class='glyphicon glyphicon-remove'>&nbsp;</span>Remove</a></td><td>{{item.firstname}}</td><td>{{item.lastname}}</td><td width='25%'><a ng-click='editUser(item.key)' class='btn btn-xs btn-primary'><span class='glyphicon glyphicon-floppy-open'>&nbsp;</span>Edit</a><a class='btn btn-success btn-xs' ng-click='graphData(item.key)'><span class='glyphicon glyphicon-stats'>&nbsp;</span>Graph</a><a class='btn btn-warning btn-xs' ng-click='upload(item.key)'><span class='glyphicon glyphicon-upload'>&nbsp;</span>Upload</a></td></tr></tbody></table></div>"
	};
});

mainApp.directive("devicesPaginatedTable", function() {
	return {
			restrict : "E",
			template : "<div class='over' name='table-responsive'><table class='table table-bordered table-striped display'><thead><tr><th></th><th class='address'>MAC Address</th><th class='Owner'>Owner&nbsp;</th><th class='Status'>Status&nbsp;</th></tr></thead>	<tfoot><tr><td colspan='6'><div ><ul class='pagination pull-left'><li ng-class='{disabled: currentPage == 0}'><a href ng-click='prevPage()'>« Prev</a></li><li ng-repeat='n in range(pagedItems.length, currentPage, currentPage + gap) ' ng-class='{active: n == currentPage}' ng-click='setPage()'><a href ng-bind='n + 1'>1</a></li><li ng-class='{disabled: (currentPage) == pagedItems.length }'><a href ng-click='nextPage(pagedItems.length)'>Next »</a></li></ul></div></td></tr><tr ng-show='!pagedItems.length'><td>&nbsp;<em>{{resultMsg}}</em></td></tr></tfoot><tbody><tr ng-repeat='item in pagedItems[currentPage] | filter:searchText'><td width='10%'><a class='btn btn-danger btn-xs' ng-really-message='Are you sure you want to remove {{ item.key }}?' ng-really-click='removeDevice($index)'><span class='glyphicon glyphicon-remove'>&nbsp;</span>Remove</a></td><td>{{item.key}}</td><td>{{item.owner}}</td><td><p class='label {{item.labeltype}}'>{{ item.status }}</p></td></tr></tbody></table></div>"
	};
});

/*mainApp.directive("usersPaginatedTable", function() {
	return {
			restrict : "E",
			template : "<div class='over' name='table-responsive'><table class='table table-bordered table-striped display'><thead><tr><th class='id'></th><th class='email'>Email&nbsp;</th><th class='firstname'>Firstname&nbsp;</th><th class='lastname'>Lastname&nbsp;</th></tr></thead><tfoot><td colspan='6'><div ><ul class='pagination pull-left'><li ng-class='{disabled: currentPage == 0}'><a href ng-click='prevPage()'>« Prev</a></li><li ng-repeat='n in range(pagedItems.length, currentPage, currentPage + gap)' ng-class='{active: n == currentPage}' ng-click='setPage()'><a href ng-bind='n + 1'>1</a></li><li ng-class='{disabled: (currentPage) == pagedItems.length }'><a href ng-click='nextPage(pagedItems.length)'>Next »</a></li></ul></div><div class='pagination pull-right'></div></td></tfoot><tbody><tr ng-repeat='item in pagedItems[currentPage]'><td width='10%'><a class='btn btn-danger btn-xs' ng-really-message='Are you sure you want to remove {{ item.firstname }} {{ item.lastname }}?' ng-really-click='removeUser()'><span class='glyphicon glyphicon-remove'>&nbsp;</span>Remove</a></td><td>{{item.email}}</td><td>{{item.firstname}}</td><td>{{item.lastname}}</td></tr></tbody></table></div>"
	};
);*/

mainApp.controller("GlobalCtrl", ["$scope", "$location", "Auth", "Users", "$timeout", function($scope, $location, Auth, Users, $timeout) {
	
		$scope.showNumItemsOnPage = [
    {	value: 5, label: '5'},
		{	value: 10, label: '10'},
		{	value: 20, label: '20'},
		{	value: 50, label: '50'},
    {	value: 100, label: '100'}
  ];
  $scope.currentNumSelection = $scope.showNumItemsOnPage[0];
	$scope.numOfItemsInDisplay = 0;
	$scope.resultMsg = "No results founds.";
	
	$scope.auth = Auth;
	
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
		this.$apply(fn);
		}
  };

    // any time auth status updates, add the user data to scope
  $scope.auth.$onAuth(function(authData) {
		$scope.safeApply(function (){
			$scope.authData = authData;
			if ($scope.authData != null){
				$scope.session = "Session expires: " + new Date(authData.expires * 1000);
				Users.child(authData.uid).on('value', function(snapshot) { 
					$scope.welcomeMsg = snapshot.val().firstname;
				});
			} else {
				$scope.session = "";
				$scope.welcomeMsg = "";
			}
		});
  });
	
	$scope.logout = function () {
		$scope.safeApply(function (){
			Auth.$unauth();
			$scope.loginAlerts = {	"type" : "alert-success",
															"message" : "Logged out successfully!"};
			$location.path('/loginUser');
		});
	};

}]);

mainApp.controller("AcctCtrl", ["$scope", "$location", "Auth", "Users", "Root", "paginateService", function($scope, $location, Auth, Users, Root, paginateService) {
	
	$scope.profile = [];
	$scope.fullUserList = [];
	$scope.passwordAlerts = {};
	$scope.newUserAlerts = {};
	$scope.isAdmin = false;
	
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
				if(fn && (typeof(fn) === 'function')) {
						fn();
				}
		} else {
				this.$apply(fn);
		}
	};
	
	Users.child(Auth.$getAuth().uid).once('value', function(snapshot) { 
		var item = {
					"key" : snapshot.key(),
					"firstname" : snapshot.val().firstname,
					"lastname" : snapshot.val().lastname,
					"email"  : snapshot.val().email
		};
		$scope.safeApply( function(fn) {
			$scope.profile.push(item);
			$scope.isAdmin = snapshot.hasChild("admin");
		});
	});

	/*$scope.showUserTable = function () {	
		Users.on('child_added', function(snapshot) { 
			var item = {
						"key" : snapshot.key(),
						"firstname" : snapshot.val().firstname,
						"lastname" : snapshot.val().lastname,
						"email"  : snapshot.val().email,
						"password" : Auth.$getAuth.password
			};
			$scope.safeApply( function(fn) {
				$scope.fullUserList.push(item);
				$scope.pagedItems = paginateService.paged($scope.fullUserList, $scope.currentNumSelection.value);
			});
		});
  };
	
	$scope.refreshTable = function(flag) {
		$scope.pagedItems = paginateService.paged($scope.fullUserList, $scope.currentNumSelection.value);
		
		if (flag)
			$scope.firstPage();
	};*/
	
	Users.child(Auth.$getAuth().uid).on('value', function(valueSnap) { 
		$scope.safeApply(function() {
				if (valueSnap.val()) {
						//item.firstname = valueSnap.val().firstname;
						//item.lastname = valueSnap.val().lastname;
				} else {
						var idx = -1;
						$scope.profile.forEach(function(e, i) {
								if (e["key"] == valueSnap.key()) {
										idx = i;
										return;
								}
						});
						if (idx > -1) {
								$scope.profile.splice(idx, 1);
						}
				}
		});
	});

	$scope.$watch("profile", function(newItems, oldItems) {
			// TODO: How do I check which item is updated in a better way?
			newItems.forEach(function(newItem) {
					oldItems.forEach(function(oldItem) {
							if (newItem["key"] == oldItem["key"]) {
									Users.child(newItem["key"]).update({"firstname": newItem.firstname,
																											"lastname": newItem.lastname});
							}
					});
			});
	}, true);
	
	$scope.cancel = function () {
		$location.path('/clients');
  };
	
	$scope.changePassword = function () {
		if (!$scope.oldPassword) {
			$scope.passwordAlerts = {	"type": "alert-danger",
																"message": "Old password not specified." };
			return;
		}
		if ($scope.newPassword === $scope.cnfNewPassword) {
			Root.changePassword({
				email       : Auth.$getAuth().password.email,
				oldPassword : $scope.oldPassword,
				newPassword : $scope.newPassword,
			}, function(error) {
				if (error === null) {
					$scope.safeApply( function(fn) {
						$scope.passwordAlerts = {	"type" : "alert-success",
																			"message" : "Password changed successfully!"};
					});
				} else {
					$scope.safeApply( function(fn) {
						$scope.passwordAlerts = { "type" : "alert-danger",
																			"message" : error };						
					});
				}
			});
		} else {
			$scope.passwordAlerts = { "type" : "alert-danger",
																"message" : "Passwords don't match" };	
		}
  };
	
	$scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;
			$scope.authData = Auth;
			
			if (!$scope.isAdmin) {
				$scope.newUserAlerts = {	
					type: "alert-danger",
					message: "User does not have sufficient permission"
				};
				return;
			}
			if (!$scope.newUserEmail && !$scope.newUserPassword && !$scope.newUserFirstname && !$scope.newUserLastname && !$scope.newUserCnfPassword){
				$scope.newUserAlerts = {	type: "alert-danger",
																	message: "Inputs cannot be blank"
				};
				return;
			}
			else if (!$scope.newUserEmail || !$scope.newUserPassword || !$scope.newUserFirstname || !$scope.newUserLastname || !$scope.newUserCnfPassword){
				$scope.newUserAlerts = {	type: "alert-danger",
																	message: "One or more input are blank"
				};
				return;
			}
			else if ($scope.newUserPassword != $scope.newUserCnfPassword) {
				$scope.newUserAlerts = {	type: "alert-danger",
																	message: "Passwords doesn't match" };
				return;
			}
			
			Users.child(Auth.$getAuth().uid).once('value', function(snapshot) {
				if (!snapshot.hasChild("admin")) {
					$scope.safeApply(function() {
						$scope.newUserAlerts = {	
							type: "alert-danger",
							message: "User does not have sufficient permission"
						};
						return;
					});
				} else {
					Auth.$createUser({
						email: $scope.newUserEmail,
						password: $scope.newUserPassword
					}).then(function(userData) {
							//$scope.message = "User created with uid: " + userData.uid;						
							new Firebase(Users.child(userData.uid).toString()).set({ 
										"firstname" : $scope.newUserFirstname,
										"lastname" : $scope.newUserLastname,
										"email"  : $scope.newUserEmail,
										"provider" : "password",
										"active" : true		
							});
							$scope.newUserAlerts = {	
								"type" : "alert-success",
								"message" : "Successfully created new user!" 
							};
							
							$scope.newUserEmail = "";
							$scope.newUserPassword = "";
							$scope.newUserFirstname = "";
							$scope.newUserLastname = "";
							$scope.newUserCnfPassword = "";
							
					}).catch(function(error) {
						$scope.newUserAlerts = {	type: "alert-danger",
																			message: "Error: " + error.code };
					});
				}
			});
    };
	
    /*$scope.removeUser = function() {
      $scope.message = null;
      $scope.error = null;
			var item = this.item;

      Auth.$removeUser({
        email: item.email,
        password: item.password
      }).then(function() {
        $scope.message = "User removed";
      }).catch(function(error) {
        $scope.error = error;
      });
    };*/
}]);

mainApp.controller("AuthUserCtrl", ["$scope", "$location", "$timeout", "$route", "Auth", "Root", function($scope, $location, $timeout, $route, Auth, Root) {
	
	$scope.loginAlerts = {};
	
	//Auth.$unauth();
	$scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
		
	if (Auth.$getAuth() != null) {
		$location.path('/clients');
	}
		
	$scope.login = function (){
		
		if (!$scope.email && !$scope.password) {
			$scope.loginAlerts = {	"type": "alert-danger",
															"message": "Inputs cannot be blank." };
			return;
		} else if (!$scope.email || !$scope.password) {
			$scope.loginAlerts = {	"type": "alert-danger",
															"message": "One input is blank or not valid email." };
			return;
		}

		Auth.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		}).then(function(authData) {
			$scope.safeApply(function (){
					$location.path('/clients');
			});
		}).catch(function(error) {
			if (error) {
				switch (error.code) {
					case "INVALID_EMAIL":
						$scope.safeApply(function (){
							$scope.loginAlerts = {	"type": "alert-danger",
																			"message": "The specified user account email is invalid." };	
						});
						break;
					case "INVALID_PASSWORD":
						$scope.safeApply(function (){
							$scope.loginAlerts = {	"type": "alert-danger",
																			"message": "The specified user account password is incorrect." };	
						});
						break;
					case "INVALID_USER":
						$scope.safeApply(function (){
							$scope.loginAlerts = {	"type": "alert-danger",
																			"message": "The specified user account does not exist." };	
						});
						break;
					default:
						$scope.safeApply(function (){
							$scope.loginAlerts = {	"type": "alert-danger",
																			"message": "Error occured: " + error.code };	
						});
				}
			} else {
				//console.log("Authenticated successfully with payload:", authData);
			}
		});
	};
	
	$scope.resetPassword = function () {
		if (!$scope.recoveryEmail) {
			return;
		}
		Root.resetPassword({
			email : $scope.recoveryEmail
		}, function(error) {
			if (error === null) {
				$scope.safeApply(function (){
					$scope.loginAlerts = {
						"type": "alert-success",
						"message": "Password reset email sent successfully" 
					};	
					$timeout(function() { $route.reload(); }, 2000);
					
				});
			} else {
				$scope.safeApply(function (){
					$scope.loginAlerts = {	
						"type": "alert-danger",
						"message": error
					};
				});
			}
		});
	};
}]);

mainApp.controller("UserIndexCtrl", ["$scope", "$location", "$filter", "Auth", "Clients", "Devices", "DevicesLoaned", "ClientMoistureData", "paginateService", function($scope, $location, $filter, Auth, Clients, Devices, DevicesLoaned, ClientMoistureData, paginateService) {

	$scope.gap = 5;
	$scope.filteredItems = [];
	$scope.groupedItems = [];
	$scope.itemsPerPage = $scope.currentNumSelection.value;
	$scope.pagedItems = [];
	$scope.currentPage = 0;	
	$scope.clients = [];
	$scope.resetDevices = [];
	   
	var count = 0;
	var innerCount = 0;

	$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if(phase == '$apply' || phase == '$digest') {
					if(fn && (typeof(fn) === 'function')) {
							fn();
					}
			} else {
					this.$apply(fn);
			}
	};
	
	Clients.on('child_added', function(snapshot) {	
		var item = {
					"key" : snapshot.key(),
					"firstname" : snapshot.val().firstname,
					"lastname" : snapshot.val().lastname
		};
		$scope.safeApply( function(fn) {
			$scope.clients.push(item);
			$scope.pagedItems = paginateService.paged($scope.clients, $scope.currentNumSelection.value);
		});	
	});

	var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };
	
	$scope.refreshTable = function(flag) {
		$scope.pagedItems = paginateService.paged($scope.clients, $scope.currentNumSelection.value);
		
		if (flag)
			$scope.firstPage();
	};

	$scope.search = function () {
		$scope.filteredItems = $filter('filter')($scope.clients, function (item) {
			for(var attr in item) {
				if (searchMatch(item[attr], $scope.searchText))
					return true;
				}
			return false;
		});
		$scope.pagedItems = paginateService.paged($scope.filteredItems, $scope.currentNumSelection.value);
		$scope.firstPage();
	};

	$scope.range = function (size,start, end) {
		var ret = [];        
		$scope.safeApply(function(){
			if (size < end) {
					end = size;
					start = size-$scope.gap;
			}
			for (var i = start; i < end; i++) {
					if (i > -1)
						ret.push(i);
			}           
		});
		return ret;
	};
	
	$scope.prevPage = function (pageItems) {
		if ($scope.currentPage > 0) {
				$scope.currentPage--;
		}
	};

	$scope.nextPage = function (numPages, pageItems) {
		if ($scope.currentPage < numPages - 1) {
			$scope.currentPage++;
		}
	};
	
	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};

	$scope.firstPage = function () {
		$scope.currentPage = 0;
	};

	$scope.lastPage = function () {
		$scope.currentPage = $scope.ItemsByPage.length - 1;
	};

	$scope.removeItem = function () {
		var item = this.item;	
		//console.log($scope.clients.indexOf(item))
		//console.log(item["key"], DevicesLoaned.child(item["key"]).toString());
		
		DevicesLoaned.child(item["key"]).on('child_added', function(snap) {
			$scope.safeApply(function() {
				$scope.resetDevices.push(snap.val().name);
			});
		});
		
		$scope.safeApply(function() {
			if ($scope.resetDevices.length != 0) {
				$scope.resetDevices.forEach(function(e, i) {
					Devices.child(e).update({ owner: ""});
					if($scope.resetDevices.length-1 == i) {
						DevicesLoaned.child(item["key"]).remove();
						ClientMoistureData.child(item["key"]).remove();
					}
				});
			}
			Clients.child(item["key"]).remove();
			$scope.clients.splice($scope.clients.indexOf(item), 1);
			$scope.refreshTable(false);
		});
	};

	$scope.editUser = function (id) {
		$location.path('/user/'+id);
	};
	
	$scope.fileData = '';
	$scope.upload = function(id){
		var f = document.getElementById('fileDialog').files[0],
		r = new FileReader();	
		
		r.onloadend = function(e){
			$scope.safeApply(function() {
				var filename = document.getElementById('fileDialog').value.split(".")[0].split("_").join(":");
				$scope.fileData = "";
			ClientMoistureData.child(id).set({[filename] : e.target.result});//.set({.to : e.target.result})
				
			});
		}
		
		r.readAsBinaryString(f);
	}
	
	$scope.viewMsg = "No client selected."
	$scope.graphData = function (id) {
		
		var data = [];
		var xaxis = [0];
		var temp = [];
		var yaxis = [];
		var count = 0;
		var len = 0;
		$scope.data = []
		$scope.series = []
		
		Clients.child(id).on("value", function(snap) {
			$scope.clientName = snap.val().firstname +" "+snap.val().lastname
			$scope.viewMsg = "Viewing data for "+$scope.clientName;
		});
		
		ClientMoistureData.child(id).once("value", function(addedSnap) {	
			if (addedSnap.hasChildren()){	
				ClientMoistureData.child(id).on("child_added", function(addedSnap) {
					var dataArr = addedSnap.val().split(',');
						xaxis = [];
						dataArr.forEach(function(entry) {
							if ($.isNumeric(entry)) {
									xaxis.push(entry);
							} else {
									temp.push(entry);
							}
						});
						len = temp.length; 
						if (len > yaxis.length) {
							yaxis = temp;
							temp = [];
						}
						$scope.safeApply(function() {
							$scope.series.push(addedSnap.key());
							$scope.labels = yaxis;
							$scope.data.push(xaxis);
						});
				});	
			} else {
				 $scope.safeApply(function() {
						$scope.viewMsg = "No data available for "+$scope.clientName;
						$scope.series = [];
						$scope.labels = [];
						$scope.data = [[0]];
				});
			 }
		});
			
		$scope.colours = [{
				fillColor: 'rgba(0, 0, 0, 0)',
				strokeColor: 'rgba(0, 0, 0, 0.8)',
				highlightFill: 'rgba(0, 0, 0, 0.8)',
				highlightStroke: 'rgba(0, 0, 0, 0.8)'
		}, {
				fillColor: 'rgba(0, 0, 0, 0)',
				strokeColor: 'rgba(255, 0, 0, 0.8)',
				highlightFill: 'rgba(255, 0, 0, 0.8)',
				highlightStroke: 'rgba(255, 0, 0, 0.8)'
		}, {
				fillColor: 'rgba(0, 0, 0, 0)',
				strokeColor: 'rgba(0, 255, 255, 1)',
				highlightFill: 'rgba(0, 255, 255, 1)',
				highlightStroke: 'rgba(0, 255, 255, 1)'
		}, {
				fillColor: 'rgba(0, 0, 0, 0)',
				strokeColor: 'rgba(0, 0, 255, 1)',
				highlightFill: 'rgba(0, 0, 255, 1)',
				highlightStroke: 'rgba(0, 0, 255, 1)'
		}];
		
		$scope.onClick = function (points, evt) {
			//console.log(points, evt);
		};
  };
}]);
	
mainApp.controller('UserDetailCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'Clients', 'Devices', 'DevicesLoaned', function($scope, $routeParams, $location, $timeout, Clients, Devices, DevicesLoaned) {
	
	$scope.user = [];
	$scope.selectOpts = [];
	$scope.devicesClientLoaned = [];
	$scope.devices = "0 device(s) available";
	$scope.noDevicesMsg = "No devices allocated.";
	
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
				if(fn && (typeof(fn) === 'function')) {
						fn();
				}
		} else {
				this.$apply(fn);
		}
	};
	
	if ($routeParams.id === "new"){
	var newUser = Clients.push({"firstname": "",
															"lastname": "" })
	var uid = newUser.key();
	$scope.heading = "Create New Client";
	} else {
		var uid = $routeParams.id;
		$scope.heading = "Edit Client";
	}

	var getClientLoanedDevices = DevicesLoaned.child(uid.toString());
	var getClientInformation = Clients.child(uid.toString());

	getClientLoanedDevices.on("child_added", function(loanedSnap) {	
		if (loanedSnap.numChildren() != 0) {
			$scope.safeApply( function(fn) {
				var item = { 
							"key" : loanedSnap.key(),
							"name" : loanedSnap.val().name };
				$scope.devicesClientLoaned.push(item);
				$scope.noDevicesMsg = "";
			});
		}
	});
	
	getClientInformation.once("value", function(clientSnap) {
		var item = {
					"key" : clientSnap.key(),
					"firstname" : clientSnap.val().firstname,
					"lastname" : clientSnap.val().lastname
		};
		$scope.safeApply( function(fn) {
			$scope.user.push(item);
		});
	});
	
		// Add devices to select
	Devices.on("child_added", function(addedSnap) {
		if (addedSnap.val().owner == "") {
			var items = {"key" : addedSnap.key()}
			$scope.safeApply( function(fn) {
				$scope.selectOpts.push(items);
				if ($scope.selectOpts.length !== 0) {
					$scope.devices = $scope.selectOpts.length + " device(s) available";
				} 
			});	
		}
	});
	
	getClientInformation.on('value', function(valueSnap) { 
		$scope.safeApply(function() {
				if (valueSnap.val()) {
						//item.firstname = valueSnap.val().firstname;
						//item.lastname = valueSnap.val().lastname;
				} else {
						var idx = -1;
						$scope.user.forEach(function(e, i) {
								if (e["key"] == valueSnap.key()) {
										idx = i;
										return;
								}
						});
						if (idx > -1) {
								$scope.user.splice(idx, 1);
						}
				}
		});
	});

	$scope.$watch("user", function(newItems, oldItems) {
			// TODO: How do I check which item is updated in a better way?
			newItems.forEach(function(newItem) {
				oldItems.forEach(function(oldItem) {
					if (newItem["key"] == oldItem["key"]) {
						getClientInformation.update({	"firstname": newItem.firstname,
																					"lastname": newItem.lastname});
							}
					});
			});
	}, true);
		
	$scope.cancel = function () {
		console.log("cancel")
		getClientInformation.once("value", function(clientSnap) {
			if ((clientSnap.val().firstname === "" && clientSnap.val().lastname === "") || (clientSnap.val().firstname === "" || clientSnap.val().lastname === "")){
				$scope.safeApply( function(fn) {
					$scope.removeDevice("");
					getClientInformation.remove();
				});			
			}
		});
		$location.path('/clients');
  };
	
	$scope.$on("$destroy", function(){
    getClientInformation.once("value", function(clientSnap) {
			if ((clientSnap.val().firstname === "" && clientSnap.val().lastname === "") || (clientSnap.val().firstname === "" || clientSnap.val().lastname === "")){
				$scope.safeApply( function(fn) {
					$scope.removeDevice("");
					getClientInformation.remove();
				});			
			}
		});
  });
	
	$scope.addDevice = function (item){
		$scope.safeApply(function() {
			console.log($scope.selectOpts.indexOf(item))
			getClientLoanedDevices.push({"name" : item.key});
			Devices.child(item.key).update({ owner : uid });
			$scope.selectOpts.splice($scope.selectOpts.indexOf(item), 1);
			$scope.devices = $scope.selectOpts.length + " device(s) available";
		});
	}
	
	$scope.removeDevice = function (id) {	
		if (id === "") {
			console.log("string");
			DevicesLoaned.child(uid).on('child_added', function(snap) {
				DevicesLoaned.child(uid).child(snap.key()).remove(function (){
					Devices.child(snap.val().name).update({ owner: ""});
					console.log("Done");
				});
			});
		} else {
			DevicesLoaned.child(uid).child(id.key).remove(function (){
				Devices.child(id.name).update({ owner: ""});
				console.log("Done");
			});
		}
		
		$scope.devicesClientLoaned.splice($scope.devicesClientLoaned.indexOf(id), 1);
		$scope.selectOpts.push({"key" : id.name});
		$scope.devices = $scope.selectOpts.length + " device(s) available";
		
	};
}]);
	
mainApp.controller("DeviceCtrl", ['$scope', '$location', 'Clients', 'Devices', 'DevicesLoaned', 'paginateService', function($scope, $location, Clients, Devices, DevicesLoaned, paginateService) {
	
	$scope.gap = 5;
	
	$scope.filteredItems = [];
	$scope.groupedItems = [];
	$scope.itemsPerPage = $scope.currentNumSelection.value;
	$scope.pagedItems = [];
	$scope.currentPage = 0;	
	$scope.resetDevices = [];
	$scope.devicesInfo = [];
	$scope.removeLoaned = [];
	$scope.ownerName = "none";
	
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
			if(phase == '$apply' || phase == '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
      } else {
				this.$apply(fn);
      }
  };
		
	Devices.on("child_added", function(snapshot) {
		if (snapshot.val().owner != "") {
				Clients.child(snapshot.val().owner).once("value", function(clientSnap) {
				$scope.ownerName = clientSnap.val().firstname + " " + clientSnap.val().lastname;
				var item = {
						"key": snapshot.key(),
						"owner": $scope.ownerName,
						"status" : "in use", 
						"labeltype" : "label-primary"
				};
				$scope.safeApply(function() {
					$scope.devicesInfo.push(item);
					$scope.pagedItems = paginateService.paged($scope.devicesInfo, $scope.currentNumSelection.value);
				});
			});
		} else {
			$scope.ownerName = "none";
			var item = {
						"key": snapshot.key(),
						"owner": $scope.ownerName,
						"status" : "available",
						"labeltype" : "label-success"
			};
				$scope.safeApply(function() {
					$scope.devicesInfo.push(item);
					$scope.pagedItems = paginateService.paged($scope.devicesInfo, $scope.currentNumSelection.value);
				});
		}
  });
	
	var searchMatch = function (haystack, needle) {
		if (!needle) {
				return true;
		}
		return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
	};
	
	$scope.refreshTable = function(flag) {
		$scope.pagedItems = paginateService.paged($scope.devicesInfo, $scope.currentNumSelection.value);
		
		if (flag)
			$scope.firstPage();
	};

	$scope.search = function () {
		$scope.filteredItems = $filter('filter')($scope.devicesInfo, function (item) {
			for(var attr in item) {
				if (searchMatch(item[attr], $scope.searchText))
					return true;
				}
			return false;
		});
		$scope.pagedItems = paginateService.paged($scope.filteredItems, $scope.currentNumSelection.value);
		$scope.firstPage();
	};

	$scope.range = function (size,start, end) {
		var ret = [];        
		$scope.safeApply(function(){
			if (size < end) {
					end = size;
					start = size-$scope.gap;
			}
			for (var i = start; i < end; i++) {
					if (i > -1)
						ret.push(i);
			}           
		});
		return ret;
	};
	
	$scope.prevPage = function (pageItems) {
		if ($scope.currentPage > 0) {
				$scope.currentPage--;
		}
	};

	$scope.nextPage = function (numPages, pageItems) {
		if ($scope.currentPage < numPages - 1) {
			$scope.currentPage++;
		}
	};
	
	$scope.setPage = function () {
		$scope.currentPage = this.n;
	};

	$scope.firstPage = function () {
		$scope.currentPage = 0;
	};

	$scope.lastPage = function () {
		$scope.currentPage = $scope.ItemsByPage.length - 1;
	};
	
	$scope.addNewDevice = function () {
		if ($scope.address != undefined) {
			Devices.child($scope.address).set({"owner": "" })
			$scope.address = ""
		} else {
			alert("No input for address. ")
		}
	}
	
	$scope.removeDevice = function (index) {
		var item = this.item;		
		
		Devices.child(item["key"]).once('value', function(snap) {
			$scope.safeApply(function() {
				var devOwner = snap.val().owner;
				if (devOwner !== "") {
					DevicesLoaned.child(devOwner).on('child_added', function (snapshot){
						if(snapshot.val().name === item["key"]) {
							DevicesLoaned.child(devOwner).child(snapshot.key()).remove();
						}
					});
				}
				
				$scope.devicesInfo.splice($scope.devicesInfo.indexOf(item), 1);
				Devices.child(item["key"]).remove();
				$scope.refreshTable(false);
			});
		});
  };
	
	$scope.back = function () {
		$location.path('/clients');
  };
		
}]);