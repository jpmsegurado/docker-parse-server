var _ = require('lodash');

var sendNotification = function(message, data){
  var tags = [];
  var headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic Nzg4NzgxNDYtZTYxOS00MmM2LTkwNDQtNTkxZDRkMTk0Y2U3"
  };


  var data = {
    included_segments:["All"],
    app_id: "a4ed5517-423e-406b-887b-1d43fd96fd8b",
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
    res.on('data', function(data) {
      console.log(JSON.parse(data))
    });
  });

  req.on('error', function(e) {
    console.log(JSON.parse(e))
  });

  req.write(JSON.stringify(data));
  req.end();
};


Parse.Cloud.afterSave('LostPet', function(request, response) {

  sendNotification('Mensagem arrobado', request.object);

  // var point = new parse.GeoPoint({ latitude: lat, longitude: long }); 
  // var query = new parse.Query('FoundPet');
  // query.withinKilometers('location', point, 25);
  // return query.find().then(function(res){
    
  // });

});