var map;
jQuery(document).ready(function(){
	map = L.map('map');
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {  // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var popup = L.popup();
	map.setView([40.2838, -3.8215], 15);
	
	map.locate({setView: true, maxZoom: 16});
	function onLocationFound(e) {
    	var radius = e.accuracy / 2;
    	L.marker(e.latlng).addTo(map).bindPopup("Tu estas a  " + radius + " metros alrededor de este punto").openPopup();
    	L.circle(e.latlng, radius).addTo(map);
	}
	map.on('locationfound', onLocationFound);

});

function addr_search() {
  	var inp = document.getElementById("addr");

  	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
  		var items = [];
		$.each(data, function(key, val) {
        var aux = val.display_name.split(', ');
        var place = [aux[0],aux[aux.length -1]];
        var place_string = place[0] + " " + place[1];
  			items.push(
    		"<li><a href='#' onclick='chooseAddr(" +
    		val.lat + ", " + val.lon + ", " + '"' + place_string + '"' +  ");return false;'>" + val.display_name +
    		'</a></li>'
 		 	);
 		 });
  		$('#results').empty();
    	if (items.length != 0) {
    		$('<p>', { html: "Search results:" }).appendTo('#results');
    		$('<ul/>', {
       		'class': 'my-new-list',
       		html: items.join('')
    		}).appendTo('#results');
    	} else {
    		$('<p>', { html: "No results found" }).appendTo('#results');
   		}
  	});
}

function chooseAddr(lat, lng,name, type) {
	var location = new L.LatLng(lat, lng);
	map.panTo(location);
  imgs_search(name);
	if (type == 'city' || type == 'administrative') {
		map.setZoom(11);
	} else {
		map.setZoom(13);
	}
}

function imgs_search(e) {
  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?tagmode=any&format=json&jsoncallback=?";
  $('<p>', { html: "Images:" }).appendTo('#results');
    $.getJSON(flickerAPI, {
      tags: e,
    }).done(function(data) {
    $.each(data.items, function(i, item) {
      $("<img>").attr("src", item.media.m).appendTo("#results");
      if (i === 3) {
        return false;
      } 
    });
  });
}