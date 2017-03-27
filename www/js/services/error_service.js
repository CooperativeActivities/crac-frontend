cracApp.factory('ErrorDisplayService', ["$ionicPopup", function($ionicPopup){
  var code = {
    ACTION_NOT_VALID: "",
    ID_NOT_VALID: "",
    ID_NOT_FOUND: "ID nicht gefunden",
    TASK_NOT_EXTENDABLE: "Aufgabe kann nicht erweitert werden",
    PERMISSIONS_NOT_SUFFICIENT: "Sie besitzen nicht die nötigen Berechtigungen",
    ORGANISATIONAL_EXTENDS_SHIFT: "",
    WORKABLE_EXTENDS_ORGANISATIONAL: "",
    WORKABLE_EXTENDS_WORKABLE: "",
    SHIFT_EXTENDS: "",
    USER_NOT_PARTICIPATING: "",
    TASK_NOT_STARTED: "",
    TASK_NOT_READY: "Aufgabe ist nicht bereit veröffentlicht zu werden.",
    TASK_NOT_JOINABLE: "An dieser Aufgabe kann nicht teilgenommen werden",
    TASK_ALREADY_IN_PROCESS: "Aufgabe bereits gestartet",
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
    CANNOT_BE_COPIED: "",
    EMPTY_DATA: "Nichts vorhanden",
    UNKNOWN_ERROR: "Unbekannter Fehler"
  }
  return {
    code: code,
    getMessagesFromCodes: function(errors){
      return errors.map(function(error){
        return code[error.name] || (code.UNKNOWN_ERROR + ": "+ error.name)
      }).join("<br>")
    },

    showError: function(errorMessage, title, okType) {
      if( !title ) title = "Fehler";
      if( !okType ) okType = "button-positive button-outline";

      $ionicPopup.alert({
        title: title,
        template: errorMessage,
        okType: okType
      })

    }
  }

}])
