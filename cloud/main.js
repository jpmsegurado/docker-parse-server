var _ = require('lodash');

Parse.Cloud.afterSave('FoundPet', function(request, response) {

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
          console.log('success notification', JSON.parse(d))
        });
      });

      req.on('error', function(e) {
        console.log('error notification', JSON.parse(e))
      });

      req.write(JSON.stringify(data));
      req.end();
    };
    response.success('bla');
    console.log(request.object);
    var lat = request.object.get('location').latitude;
    var long = request.object.get('location').longitude;
    var point = new Parse.GeoPoint(lat, long); 
    var query = new Parse.Query('LostPet');
    query.include('user');
    query.withinKilometers('location', point, 25);
    query.find({
      success: function(res){
        var players = [];
        _.forEach(res, function(item) {
          if(request.object.get('user').toJSON().objectId !== item.get('user').toJSON().objectId){
            players.push(item.get('user').toJSON().player_id);
          }
        });

        sendNotification('Há pets encontrados próximo ao local onde você perdeu seu pet', {
          test: request.object.get('user').toJSON().objectId,
          ids: players
        }, players);
      },
      error: function(err) {
        console.log('error', err.message);
        response.success(err.message);
      }
    });
  } catch(e) {
    console.log('err catch', e.message); 
    response.success(e.message);
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
        response.success({
          error: err,
          point: point,
          url: Parse.serverURL,
          app_id: Parse.app_id
        });
      }
    });
  } catch(e) {
    response.success(e.message); 
  }
})