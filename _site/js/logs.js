// AngularJS controller for the logs table.
function logsCtrl($scope, $http) {
	$scope.pageSize = initialLogsData.pageSize;
	$scope.sortBy = initialLogsData.sortBy;
	$scope.sortReverse = initialLogsData.sortReverse;
	$scope.pagedLogs = initialLogsData.pagedLogs;
	$scope.nextPageLinks = initialLogsData.nextPageLinks;
	$scope.exports = initialLogsData.exports;
	$scope.gameID = initialLogsData.gameID;
	$scope.pageIndex = 0;

	// Returns the current page of logs.
	$scope.currentPage = function() {
		return $scope.pagedLogs[$scope.pageIndex];
	};

	// Whether a previous logs page is available before the current one.
	$scope.hasPrevPage = function() {
		return $scope.pageIndex > 0;
	};

	// Whether a next page of logs is available after the first one.
	$scope.hasNextPage = function() {
		return $scope.nextPageLinks.length > $scope.pageIndex;
	};

	// Displays the previous page of logs.
	$scope.prevPage = function() {
		$scope.pageIndex--;
	};

	// Fetches a page of logs from the server.
	$scope.fetchPage = function(nextPageLink, callback) {
		console.log('fetching from', nextPageLink);
		$http.get(nextPageLink)
			.success(function(data, status, headers) {
				var linkHeader = headers('Link');

				if (linkHeader != null) {
					// Extract next page URL.
					var link = urlFromLinkHeader(linkHeader);
					$scope.nextPageLinks.push(link);
				}

				$scope.pagedLogs.push(data);

				if (callback) {
					callback();
				}
			});
	};

	// Displays the next page of logs, fetching them if necessary.
	$scope.nextPage = function() {
		if ($scope.pageIndex + 1 >= $scope.pagedLogs.length) {
			// Fetch next page from server.
			var nextPageLink = $scope.nextPageLinks[$scope.pageIndex];
			$scope.fetchPage(nextPageLink, function() {
				$scope.pageIndex++;
			});
		} else {
			$scope.pageIndex++;
		}
	};

	// Shows or hides the log's stack trace.
	$scope.showTrace = function(log) {
		var trace = log.trace.replace(/\n/gi,'<br />');
		$('#trace-modal .message').text(log.message);
		$('#trace-modal .trace').html(trace);
	};
	
	$scope.getClassType = function(type) {
	    var classType = 'label label-';
	    classType += (type == 'exception' || type == 'error') ? 'danger' : type;
	    return classType;
	};

	// Removes the selected logs from the server.
	$scope.deleteSelected = function() {
		// TODO: Delete logs in a single call.
		angular.forEach($scope.currentPage(), function(log) {
			if (log.selected) {
				var url = '/api/1/logs/' + log.log_id;
				$http.delete(url);
				log.deleted = true;
			}
		});

		// Remove logs flagged for deletion.
		$scope.pagedLogs[$scope.pageIndex] = _.reject($scope.currentPage(), function(log) {
			return log.deleted;
		});
	};

	// Selects all the current logs.
	$scope.selectAll = function() {
		angular.forEach($scope.currentPage(), function(log) {
			log.selected = true;
		});
	};

	// Deselects all the current logs.
	$scope.selectNone = function() {
		angular.forEach($scope.currentPage(), function(log) {
			log.selected = false;
		});
	};

	// Returns true if more than one log is selected.
	$scope.someSelected = function() {
		var result = _.some($scope.currentPage(), function(log) {
			return log.selected;
		});

		return result;
	};

	// Returns true if all logs are selected.
	$scope.allSelected = function() {
		var result = _.every($scope.currentPage(), function(log) {
			return log.selected;
		});

		return result;
	};

	// Initiates the export logs process.
	$scope.exportLogs = function() {
		var url = '/api/1/logs/export';

		$http.post(url).success(function() {
			$('#export-logs-modal').modal('hide');
		});
	};

	// Initialize the delete logs process.
	$scope.deleteAllLogs = function() {
		var url = '/api/1/logs';

		$http.delete(url).success(function() {
			$('#delete-logs-modal').modal('hide');
			$scope.pageIndex = 0;
			$scope.pagedLogs = [];
			$scope.nextPageLinks = [];
		});
	};

	// Returns true if the table is sorted by the given attribute.
	$scope.isSortedBy = function(sortedBy) {
		return $scope.sortBy === sortedBy;
	};

	// Re-sorts the table.
	$scope.resort = function(sortBy) {
		if ($scope.sortBy === sortBy) {
			// We're already sorting by this criteria; change direction.
			$scope.sortReverse = !$scope.sortReverse;
		} else {
			$scope.sortBy = sortBy;
		}

		// Reset.
		$scope.pagedLogs = [];
		$scope.nextPageLinks = [];
		$scope.pageIndex = 0;

		// Fetch initial page of logs.
		var getParameters = {
			limit: $scope.pageSize,
			sortby: $scope.sortBy,
			reverse: $scope.sortReverse
		};

		var pageLink = '/api/1/logs?' + encodeQueryData(getParameters);
		$scope.fetchPage(pageLink);
	};
	
	$scope.setExportToDelete = function(exportFile) {
	    exportFile.confirmDelete = true;
	}
	
	$scope.confirmDelete = function(exportFile) {
	    if (typeof exportFile.confirmDelete == 'undefined' || 
	        exportFile.confirmDelete == false) {
	        return false;
	    }
	    
	    return true;
	}
	
	$scope.cancelConfirmDelete = function(exportFile) {
	    exportFile.confirmDelete = false;
	}
	
	// Initiates a task to delete an exported feedback file.
	$scope.deleteExport = function(exportFile) {
		var url = '/api/1/logs/export/' + exportFile.name + '/delete';
        
		$http.delete(url).success(function() {
			exportFile.deleted = true;
			
    		$scope.exports = _.reject($scope.exports, function(file) {
    			return file.deleted;
    		});
		});
		
		return false;
	};
}
