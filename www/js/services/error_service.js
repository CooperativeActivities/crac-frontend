cracApp.factory('ErrorDisplayService', ["$ionicPopup", function($ionicPopup){

	var errorFactory = {
		code: {
			ACTION_NOT_VALID: "",
			ID_NOT_VALID: "",
			ID_NOT_FOUND: "",
			TASK_NOT_EXTENDABLE: "",
			PERMISSIONS_NOT_SUFFICIENT: "",
			ORGANISATIONAL_EXTENDS_SHIFT: "",
			WORKABLE_EXTENDS_ORGANISATIONAL: "",
			WORKABLE_EXTENDS_WORKABLE: "",
			SHIFT_EXTENDS: "",
			USER_NOT_PARTICIPATING: "",
			TASK_NOT_STARTED: "",
			TASK_NOT_READY: "Aufgabe ist nicht bereit veröffentlicht zu werden.",
			TASK_NOT_JOINABLE: "",
			TASK_ALREADY_IN_PROCESS: "",
			CHILDREN_NOT_READY: "Unteraufgaben sind noch nicht bereit.",
			UNDEFINED_ERROR: "",
			START_NOT_ALLOWED: "",
			NOT_COMPLETED_BY_USERS: "",
			QUANTITY_TOO_SMALL: "",
			QUANTITY_TOO_HIGH: "",
			QUANTITY_INCORRECT: "",
			DATASETS_ALREADY_EXISTS: "",
			JSON_READ_ERROR: "",
			JSON_MAP_ERROR: "",
			JSON_WRITE_ERROR: "",
			RESOURCE_UNCHANGEABLE: "",
			TASK_IS_FULL: "",
			USERS_NOT_FRIENDS: "",
			WRONG_TYPE: "",
			ALREADY_FILLED: "",
			NOT_FOUND: "",
			TASK_HAS_OPEN_AMOUNT: "",
			CANNOT_BE_COPIED: ""
		},
		
		showError: function(obj, title, okType) {
			if( !title ) title = "Fehler";
			if( !okType ) okType = "button-positive button-outline";

			console.log('Error: ', obj);
			var message = "";
			
			if(obj.data.status == 403){
			  message += "<br>Du hast die Berechtigungen nicht";
			} 
			if(obj.data.status == 500){
			  message += "<br>Server Fehler";
			}

			if(obj.data.errors) {
				for(var i=0; i<obj.data.errors.length; i++){
					var errMsg = this.code[obj.data.errors[i]];
					if(!errMsg) {
						errMsg = "Unbekannten Fehler: " + obj.data.errors[i];
					}
					message += "<br>"+errMsg;
				}
			}
			
			$ionicPopup.alert({
			  title: title,
			  template: message,
			  okType: okType
			})
		},
		
		showCustomError: function(errorMessage, title, okType) {
			if( !title ) title = "Fehler";
			if( !okType ) okType = "button-positive button-outline";
			
			$ionicPopup.alert({
			  title: title,
			  template: errorMessage,
			  okType: okType
			})

		}
	}

	return errorFactory;
}])
