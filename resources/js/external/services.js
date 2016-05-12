'use strict';

angular.module('sparetickets')    
    .service("UserService", function ($http, $cookieStore) {
        var userObj = {};
        var adminId = 0;
        var roles = [];
        return {
            getUserRoles: function(){
              return $cookieStore.get('maya_user').rolesFeatures.roles; 
            },
            getUserFeatures: function(){
              return $cookieStore.get('maya_user').rolesFeatures.features;
            },
            getAccessToken: function(){
              return $cookieStore.get('maya_user').accessTokenObj.access_token;
            },
            setUserObj: function (obj) {                  
              $cookieStore.put('maya_user', obj);
              $cookieStore.put('maya_loggedin', 'true');
            },
            getUserObj: function () {
              if($cookieStore.get('maya_loggedin')=='true'){
                return $cookieStore.get('maya_user');
              }
              else{
                return null;
              }
            },
            destroyUserObj: function () {
              $cookieStore.put('maya_user', null);
              $cookieStore.put('maya_loggedin', 'false');                    
            },
            getAdminId: function () {
              return adminId;
            },
            setAdminId: function (id) {
              adminId = id;
            },
            isAdmin: function () {
              var user = this.getUserObj();
              if (user && user.roleId == this.getAdminId()) {
                  return true;
              }
              else {
                  return false;
              }
            },
            setRoles: function (roleArray) {
                roles = roleArray;
            },
            getRoles: function () {
                return roles;
            },
            isRemedinetAssociated: function(){
              return getHospitalObj().isRemedinetAssociated;
            },
            setHospitalObj: function(obj){                  
                $cookieStore.put('hospital', obj);                  
            },
            displayThis: function(feature, _role){
              if(_role){
                var role = _role.toLowerCase();
                //role can be cms, guest, operations, finance, admin
                switch(feature){
                  case "switchHosp":
                    if(role=="cms")
                      return true;
                    else
                      return false;
                    break;
                  case "newadmission":
                    if(role=="guest" || role=="cms" || role=="cms")
                      return false;
                    else
                      return true;
                    break;
                  case "claimaction":
                    if(role=="guest" || role=="cms" || role=="hr" )
                      return false;
                    else
                      return true;
                    break;
                  case "operations":
                    if(role=="operations" || role=="admin" || role=="cms" || role=="hr")
                      return true;
                    else
                      return false;
                    break;
                  case "finance":
                    if(role=="finance" || role=="admin" || role=="cms" || role=="hr")
                      return true;
                    else
                      return false;
                    break;
                  default:
                    return false;
                    break;
                }
              }
              else{
                return false;
              }
            },
            fetchRoles: function () {
                var self = this;
                $http.get("http://demoapi.medibuddy.in/hosp/master/roles.json").
                  success(function (roleData) {
                      if (roleData.isSuccess) {
                          roles = roleData.lookUpData;
                          for (var i = 0; i < roles.length; i++) {
                              if (roles[i].lookUpValue == "Admin") {
                                  self.setAdminId(roles[i].lookUpId);
                              }
                          };
                          self.setRoles(roles);
                      }
                  })
                  .error(function () {
                      console.log("Error");
                  })
            },
            isActive: function () {
                var user = this.getUserObj();
                if (user) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    })
    .service("UtilitiesService", function ($http, $rootScope, $location) {
        var urlPrefix = "http://mycollect.in/ticketsws/index.php/data";
        // var urlPrefix = "http://localhost:8888/ticketsws/index.php/data/";
        
        return {
            approvalText: function(value){
              if(value){
                return "Approved";
              }
              else{
                return "Pending Approval";
              }
            },
            getUrlPrefix: function (isMaya) {
                if(isMaya=="bo"){
                  return medibuddyplus;
                }
                else{
                  return urlPrefix;
                }
            },
            showImg: function(status){
              if(status=="1"){
                return "ok green";
              }
              else{
                return "remove red";
              }
            },
            openNewTab: function (name, id, event, parent) {                  
                if ($("#" + id).length == 0) {
                    if(!parent){
                      $("#myTab").append(
                        $("<li>").html('<a href="/#tab' + id + '" id="' + id + '" role="tab" data-toggle="tab" class="customer-tab">' + name + '<i class="close">×</i></a>')
                      );
                    }
                    else{
                      $("#SettledTab").append(
                        $("<li>").html('<a href="/#tab' + id + '" id="' + id + '" role="tab" data-toggle="tab" class="customer-tab">' + name + '<i class="close">×</i></a>')
                      );
                    }
                    $("#"+id).css("width",$("#"+id).width()+50+"px");
                }
                if(!parent){
                  $('#myTab a#' + id).tab('show');
                }
                else{
                  $('#SettledTab a#' + id).tab('show');
                }
            },
            formatCurrency : function (inputCurrency) {
                if(inputCurrency){
                  inputCurrency = inputCurrency.toString();
                  var afterPoint = '';
                  if (inputCurrency.indexOf('.') > 0)
                      afterPoint = inputCurrency.substring(inputCurrency.indexOf('.'), inputCurrency.length);
                  inputCurrency = Math.floor(inputCurrency);
                  inputCurrency = inputCurrency.toString();
                  var lastThree = inputCurrency.substring(inputCurrency.length - 3);
                  var otherNumbers = inputCurrency.substring(0, inputCurrency.length - 3);
                  if (otherNumbers != '')
                      lastThree = ',' + lastThree;
                  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
                  return res;
                }            
                else{
                  return 0;
                }      
            },
            formatDate : function(inputDate){
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName().substring(0,3) + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName().substring(0,3) + " " + now.getFullYear();
                var dispDate = dtString.split(" ");

                // if (dtString == nowString) {
                //     return "Today";
                // }
                // else {
                    return dispDate[1] + " " + dispDate[0]; 
                    // + " " + dispDate[2];
                // }
            },
            formatDateNumber: function(inputDate){
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/",""), 10))
                var dt = inputDate ? new Date(inputDate) : new Date();
                var mins = dt.getMinutes().length==1?'0'+dt.getMinutes():dt.getMinutes();
                var hrs = dt.getHours()<10?"0"+dt.getHours():dt.getHours();  
                return dt.getFullYear()+"/"+(dt.getMonth()+1)+"/"+dt.getDate()+" "+hrs+":"+mins;                
            },
            formatTime : function(inputDate){
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName() + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName() + " " + now.getFullYear();
                var dispDate = dtString.split(" ");
                var mins = dt.getMinutes().length==1?'0'+dt.getMinutes():dt.getMinutes();
                var hrs = dt.getHours()<10?"0"+dt.getHours():dt.getHours();  
                mins = mins<10?"0"+mins:mins;                 
                var time = hrs + ":" + mins;
                time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                if (time.length > 1) { // If time format correct
                  time = time.slice (1);  // Remove full string match value
                  time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                  time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                return time.join ('');                  
            },
            getAuditDate : function (inputDate) {                  
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/",""), 10))
                return this.formatDate(inputDate);                  
            },
            getAuditTime: function (inputDate){
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/",""), 10))
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName() + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName() + " " + now.getFullYear();
                var dispDate = dtString.split(" ");
                var mins = dt.getMinutes().length==1?'0'+dt.getMinutes():dt.getMinutes();
                var hrs = dt.getHours()<10?"0"+dt.getHours():dt.getHours();  
                mins = mins<10?"0"+mins:mins;                 
                var time = hrs + ":" + mins;
                time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
                if (time.length > 1) { // If time format correct
                  time = time.slice (1);  // Remove full string match value
                  time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
                  time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                return time.join ('');                  
            },
            compareDate : function (inputDate) {                  
                inputDate = new Date(parseInt(inputDate.replace("/Date(", "").replace(")/",""), 10))
                var dt = inputDate ? new Date(inputDate) : new Date();
                var now = new Date(Date.now());
                var dtString = dt.getDate() + " " + dt.getMonthName() + " " + dt.getFullYear();
                var nowString = now.getDate() + " " + now.getMonthName() + " " + now.getFullYear();
                var dispDate = dtString.split(" ");

                if (dtString == nowString) {
                    var mins = dt.getMinutes()=='0'?'00':dt.getMinutes();
                    var time = dt.getHours() + ":" + mins;
                    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

                    if (time.length > 1) { // If time format correct
                      time = time.slice (1);  // Remove full string match value
                      time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
                      time[0] = +time[0] % 12 || 12; // Adjust hours
                    }
                    // var x = time.join ('');
                    // return "Today"+x;
                    return "Today";
                }
                else if (dt.getFullYear() == now.getFullYear()) {
                    return dispDate[1] + " " + dispDate[0];
                }
                else {
                    return dispDate[1] + " " + dispDate[0] + " " + dispDate[2];
                }
            },
            makeAjaxCalls: function(url, data, method, accessToken){
              if(method.toLowerCase()=="get"){
                // $httpProvider.defaults.headers.get = { 'AccessToken' : accessToken }
                var promise = $http.get(url,data);  
              }
              else{
                var promise = $http({
                    method: method,
                    url: url,
                    data: data,
                    headers:{
                      "AccessToken":accessToken
                    }
                });
              }             
              promise.catch(function(error){
                //Checking if the accessToken is invalid and signing the user out of the system!
                if(error.status==403 && error.statusText =="Forbidden"){
                  // UserService.destroyUserObj();
                  $rootScope.$emit('signout');
                  $location.path("/");
                }              
              }) 
              return promise;
            },
            addFileInput: function(id){
                var suffix = Math.floor((Math.random() * 100) + 1);
                $("#"+id).append('<br><input type="file" name="files'+suffix+'" id="">');
            } 
        }
    })