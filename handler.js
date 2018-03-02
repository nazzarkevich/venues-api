'use strict';
const https = require('https');
const Json2csvParser = require('json2csv').Parser;

module.exports.hello = (event, context, callback) => {
  let lat = +event.lat;
  let lng = +event.lng;
  let location = lat + ',-' + lng;
  let venue = event.venue;
  let km = event.radius * 10;
  let url = `https://api.foursquare.com/v2/venues/search?ll=${location}&query=${venue}&radius=${km}&client_id=HXYXXXE0OVLM50ICE2Q4JLLYEFISC2LAPNNYLBPX3TNXEKII&client_secret=U0HAMWPLJV2FLHCRAXY0CKW2DJ1ERGUSH303FD3QJZPHED3R&v=20180228`;

  const fields = ['name', 'city', 'latitude', 'longitude'];

  let req = https.get(url, res => {
    res.setEncoding('utf8');
    let body = '';

    res.on('data', data => {
      body += data;
    });

    res.on('end', () => {
      body = JSON.parse(body);
      let newBody = getValues(body.response.venues);
      const json2csvParser = new Json2csvParser({ fields, quote: ''});
      const csv = json2csvParser.parse(newBody);
      callback(null, csv);
    });
  });
};

function getValues(obj) {
  let newData = [];
  for(let key in obj) {
    let newObj = {};
    if(obj[key].hasOwnProperty('name')) {
    	newObj.name = obj[key].name;
    }
    if(obj[key].hasOwnProperty('location')) {
    	if(obj[key].location.hasOwnProperty('city')) {
    		newObj.city = obj[key].location.city;
      }
    	if(obj[key].location.hasOwnProperty('address')) {
    		newObj.address = obj[key].location.address;
      }
    	if(obj[key].location.hasOwnProperty('lat')) {
    		newObj.latitude = obj[key].location.lat;
      }
    	if(obj[key].location.hasOwnProperty('lng')) {
    		newObj.longitude = obj[key].location.lng;
      }
    }
    newData.push(newObj);
  }
  return newData;
}
