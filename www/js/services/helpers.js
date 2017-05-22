
cracApp.factory('Helpers', ["$http", "ErrorDisplayService", function($http, ErrorDisplayService){
  // URL to REST-Service
  var _baseURL = window.crac_config.SERVER;

  function ajax(url, method, args){
    args = args || {}
    var handleSpecificErrors, transformResponse
    if(!args.handleSpecificErrors || !(args.handleSpecificErrors instanceof Function)){
      handleSpecificErrors = function(){}
    } else {
      handleSpecificErrors = args.handleSpecificErrors
    }
    if(!args.transformResponse || !(args.transformResponse instanceof Function)){
      transformResponse = function(response){ return response.data }
    } else {
      transformResponse = args.transformResponse
    }
    return $http[method](_baseURL + url, args.payload)
      .then(function(response){
        if(response && response.data && response.data.success){ return transformResponse(response); }
        else {
          throw response
        }
      }, function(response){
        // handle specific errors first since we might want to have a special message for 404, for example
        var res = handleSpecificErrors(response);
        // if the function returned something instead of throwing, we return that - prevents errors from throwing
        if(res){ return res; }

        switch(response.status){
          case -1:
            throw { error: response, message: "Keine Verbindung" };
            break;
          case 401:
            throw { error: response, message: "Sie sind nicht eingeloggt." };
            break;
          case 404:
            throw { error: response, message: "Resource nicht gefunden" };
            break;
          case 400:
            if(response.data && response.data.errors){
              throw { error: response, message: ErrorDisplayService.getMessagesFromCodes(response.data.errors) };
            }
            break;
        }
        throw { error: response, message: "Anderer Fehler" };
      });
  }
  return {
    ajax: ajax
  }
}]);
