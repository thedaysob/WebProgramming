var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 42.352271, lng: -71.05524200000001},
        zoom: 13
    });


/* MAP DATA */
    var stations = [
        {
            position: new google.maps.LatLng(42.395428, -71.142483),
            stop_id: 'alfcl',
            stop_name: 'Alewife'
        }, {
            position: new google.maps.LatLng(42.39674, -71.121815),
            stop_id: 'davis',
            stop_name: 'Davis'
        }, {
            position: new google.maps.LatLng(42.3884, -71.11914899999999),
            stop_id: 'portr',
            stop_name: 'Porter Square'
        }, {
            position: new google.maps.LatLng(42.373362, -71.118956),
            stop_id: 'harsq',
            stop_name: 'Harvard Square'
        }, {
            position: new google.maps.LatLng(42.365486, -71.103802),
            stop_id: 'cntsq',
            stop_name: 'Central Square'
        }, {
            position: new google.maps.LatLng(42.36249079, -71.08617653),
            stop_id: 'knncl',
            stop_name: 'Kendall/MIT'
        }, {
            position: new google.maps.LatLng(42.361166, -71.070628),
            stop_id: 'chmnl',
            stop_name: 'Charles/MGH'
        }, {
            position: new google.maps.LatLng(42.35639457, -71.0624242),
            stop_id: 'pktrm',
            stop_name: 'Park Street'
        }, {
            position: new google.maps.LatLng(42.355518, -71.060225),
            stop_id: 'dwnxg',
            stop_name: 'Downtown Crossing'
        }, {
            position: new google.maps.LatLng(42.352271, -71.05524200000001),
            stop_id: 'sstat',
            stop_name: 'South Station'
        }, {
            position: new google.maps.LatLng(42.342622, -71.056967),
            stop_id: 'brdwy',
            stop_name: 'Broadway'
        }, {
            position: new google.maps.LatLng(42.330154, -71.057655),
            stop_id: 'andrw',
            stop_name: 'Andrew'
        }, {
            position: new google.maps.LatLng(42.320685, -71.052391),
            stop_id: 'jfk',
            stop_name: 'JFK/UMass'
        }, {
            position: new google.maps.LatLng(42.31129, -71.053331),
            stop_id: 'shmnl',
            stop_name: 'Savin Hill'
        }, {
            position: new google.maps.LatLng(42.300093, -71.061667),
            stop_id: 'fldcr',
            stop_name: 'Fields Corner'
        }, {
            position: new google.maps.LatLng(42.29312583, -71.06573796000001),
            stop_id: 'smmnl',
            stop_name: 'Shawmut'
        }, {
            position: new google.maps.LatLng(42.284652, -71.06448899999999),
            stop_id: 'asmnl',
            stop_name: 'Ashmont'
        }, {
            position: new google.maps.LatLng(42.275275, -71.029583),
            stop_id: 'nqncy',
            stop_name: 'North Quincy'
        }, {
            position: new google.maps.LatLng(42.2665139, -71.0203369),
            stop_id: 'wlsta',
            stop_name: 'Wollaston'
        }, {
            position: new google.maps.LatLng(42.251809, -71.005409),
            stop_id: 'qnctr',
            stop_name: 'Quincy Center'
        }, {
            position: new google.maps.LatLng(42.233391, -71.007153),
            stop_id: 'qamnl',
            stop_name: 'Quincy Adams'
        },  {
            position: new google.maps.LatLng(42.2078543, -71.0011385),
            stop_id: 'brntn',
            stop_name: 'Braintree'
        }
    ];


/*PUT STATION ON GOOGLE MAP*/
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var requestURL = 'https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=place-';

    stations.forEach(function(station) {
        var marker = new google.maps.Marker({
            position: station.position,
            icon: iconBase + 'rail.png',
            map: map
        });
        
        var request = new XMLHttpRequest();
        request.open('GET', requestURL + station.stop_id, true);
        var schedule = '<h1>' + station.stop_name + '</h1>';
        request.onreadystatechange = function() {
        	if (request.readyState == 4 && request.status == 200) {
        		theData = request.responseText;
            	data = JSON.parse(theData);
            	if (data.data.length == 0)
            		schedule = schedule + 'Not available at the moment';
            	else {
            		data.data.forEach(function(element) {
                		var arrival = element.attributes.arrival_time;
                		var departure = element.attributes.departure_time;
                		if (arrival == null)
                			arrival = 'Not Available';
                		if (departure == null)
                			departure = 'Not Available';
                		schedule = schedule + '<p>' + 'Arriving: ' + arrival + '<br />' + 'Departure: ' + departure + '<br />' + '</p>';   
            		});
            	}

        		var infoWindow = new google.maps.InfoWindow({
            		content: schedule
        		});

        		marker.addListener('click', function() {
            		infoWindow.open(map, marker)
        		});
            }
        };
        request.send();
    });

/*Train Path*/
    var AlewifetoJFK = [];
    var JFKtoAshmont = [];
    var JFKtoBrain = [stations[12].position];

    for (i = 0; i < 13; i++)
    	AlewifetoJFK[i] = stations[i].position;

    for (i = 0; i < 5; i++)
    	JFKtoAshmont[i] = stations[i+12].position;

    for (i = 1; i < 6; i++)
    	JFKtoBrain[i] = stations[i+16].position;

    var JFKPath = new google.maps.Polyline({
        path: AlewifetoJFK,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    var AshmontPath = new google.maps.Polyline({
        path: JFKtoAshmont,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    var BrainPath = new google.maps.Polyline({
        path: JFKtoBrain,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    JFKPath.setMap(map);
    AshmontPath.setMap(map);
    BrainPath.setMap(map);

/*MY GEO LOCATION*/
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                icon: iconBase + 'man.png',
                map: map
            });
            map.setCenter(marker.position);

            var closest_station = {distance: undefined, station: undefined, position: undefined};
            stations.forEach(function(station) {
                distance = google.maps.geometry.spherical.computeDistanceBetween(marker.position, station.position);
                if (closest_station.distance == undefined || distance < closest_station.distance) {
                	closest_station.position = station.position;
                    closest_station.distance = distance;
                    closest_station.station = station.stop_name;
                }
            });

            infoWindow = new google.maps.InfoWindow({
                content: "<p>" + 'Closest Station: ' + closest_station.station + "<br />" + (closest_station.distance/1609.344) + ' miles away' + "</p>"
            })
            marker.addListener('click',function() {
                infoWindow.open(map, marker)
            });
            var pathToStation = new google.maps.Polyline({
            	path: [marker.position, closest_station.position],
            	geodesic: true,
            	strokeColor: '#FF0000',
            	strokeOpacity: 1.0,
            	strokeWeight: 2
            });
            pathToStation.setMap(map);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}