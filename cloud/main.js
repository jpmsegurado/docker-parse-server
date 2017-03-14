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
        included_player_ids: ids,
        // included_segments:["All"],
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

          players.push(item.get('user').toJSON().player_id);

          if(request.object.get('user').toJSON().objectId !== item.get('user').toJSON().objectId){
            // players.push(item.get('user').toJSON().player_id);
          }
        });

        let usersQuery = new Parse.Query(Parse.User);
        usersQuery.withinKilometers('address_point', point, 25);

        usersQuery.find({
          success: function(users) {
            const parsed = _.map(users, function(u){ return u.toJSON() });
            _.forEach(parsed, function(usr) { 
              !!usr.player_id && players.push(usr.player_id) 
            });
            sendNotification('Há pets encontrados próximo ao local onde você perdeu seu pet', {
              test: request.object.get('user').toJSON().objectId,
              ids: players
            }, players);
          }
        });

      },
      error: function(err) {
        console.log('error', err.message);
      }
    });
  } catch(e) {
    console.log('err catch', e.message); 
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
        included_player_ids: ids,
        // included_segments:["All"],
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
    
    var lat = request.params.object.location.latitude;
    var long = request.params.object.location.longitude;
    var point = new Parse.GeoPoint(lat, long); 
    var query = new Parse.Query('LostPet');
    query.include('user');
    query.withinKilometers('location', point, 25);
    query.find({
      success: function(res){
        var players = [];
        _.forEach(res, function(item) {

          players.push(item.get('user').toJSON().player_id);

          if(request.object.get('user').toJSON().objectId !== item.get('user').toJSON().objectId){
            // players.push(item.get('user').toJSON().player_id);
          }
        });

        let usersQuery = new Parse.Query(Parse.User);
        usersQuery.withinKilometers('address_point', point, 25);

        usersQuery.find({
          success: function(users) {
            const parsed = _.map(users, function(u){ return u.toJSON() });
            _.forEach(parsed, function(usr) { 
              !!usr.player_id && players.push(usr.player_id) 
            });
            sendNotification('Há pets encontrados próximo ao local onde você perdeu seu pet', {
              test: request.object.get('user').toJSON().objectId,
              ids: players
            }, players);

            response.success({
              test: request.object.get('user').toJSON().objectId,
              ids: players
            });

          }, error: function(err) {
            response.error(err.message);
          }
        });

      },
      error: function(err) {
        console.log('error', err.message);
        response.error(err.message);
      }
    });
  } catch(e) {
    console.log('err catch', e.message); 
    response.error(e.message);
  }

});


