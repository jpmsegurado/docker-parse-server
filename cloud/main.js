var _ = require('lodash');

Parse.Cloud.afterSave('FoundPet', function(request) {

  try {
    var sendNotification = function(message, data, ids){
      var tags = [];
      var headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic Nzg4NzgxNDYtZTYxOS00MmM2LTkwNDQtNTkxZDRkMTk0Y2U3"
      };


      var data = {
        // included_player_ids: ids,
        included_segments:["All"],
        app_id: "11ccaccc-f923-4474-b1e8-c4b3b6dfa1da",
        contents: {"en": message},
        data: data
      };

      var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };

      var https = require('https');
      var req = https.request(options, function(res) {
        res.on('data', function(d) {
          console.log(JSON.parse(d))
        });
      });

      req.on('error', function(e) {
        console.log(JSON.parse(e))
      });

      req.write(JSON.stringify(data));
      req.end();
    };
    
    var lat = request.object.location.latitude;
    var long = request.object.location.longitude;
    var point = new Parse.GeoPoint(lat, long); 
    var query = new Parse.Query('LostPet');
    query.withinKilometers('location', point, 25);
    query.find({
      success: function(res){
        sendNotification('Mensagem arrobado', res);
      },
      error: function(err) {
        console.log(err.message);
      }
    });
  } catch(e) {
    console.log(e.message); 
  }

});


Parse.Cloud.define('bla', function(request, response) {
  
  try {
    var sendNotification = function(message, data, ids){
      var tags = [];
      var headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic Nzg4NzgxNDYtZTYxOS00MmM2LTkwNDQtNTkxZDRkMTk0Y2U3"
      };


      var data = {
        // included_player_ids: ids,
        included_segments:["All"],
        app_id: "11ccaccc-f923-4474-b1e8-c4b3b6dfa1da",
        contents: {"en": message},
        data: data
      };

      var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };

      var https = require('https');
      var req = https.request(options, function(res) {
        res.on('data', function(d) {
          console.log(JSON.parse(d))
        });
      });

      req.on('error', function(e) {
        console.log(JSON.parse(e))
      });

      req.write(JSON.stringify(data));
      req.end();
    };

    
    var lat = request.params.location.latitude;
    var long = request.params.location.longitude;
    var point = new Parse.GeoPoint(lat, long); 
    var query = new Parse.Query('LostPet');
    query.withinKilometers('location', point, 25);
    query.find({
      success: function(res){
        sendNotification('Mensagem arrobado', res);
        response.success(res);
      },
      error: function(err) {
        response.success('error', err);
      }
    });
  } catch(e) {
    response.success(e.message); 
  }
})