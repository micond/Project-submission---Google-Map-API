// global variables
var map;
var markers = [];
var locationsArray = [{
        name: "Most SNP",
        lat: 48.138919,
        long: 17.104624,
        heading: 180,
        pitch: 10
    }, {
        name: "Blue Church",
        lat: 48.143621,
        long: 17.116953,
        heading: 190,
        pitch: 20
    }, {
        name: "Bratislava Castle",
        lat: 48.141679,
        long: 17.099819,
        heading: 90,
        pitch: 20
    }, {
        name: "Grassalkovich Palace",
        lat: 48.149203,
        long: 17.107712,
        heading: 135,
        pitch: 10
    }, {
        name: "Sad Janka Kráľa",
        lat: 48.135043,
        long: 17.109239,
        heading: 40,
        pitch: 20
    },
    {
        name: "Kamzík TV Tower",
        lat: 48.182441,
        long: 17.095325,
        heading: 280,
        pitch: 40
    }
];

// initialization of google maps api
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(48.143506, 17.105588),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.roadmap,
        styles: map_styles
    });
    setMarkers(map, locationsArray);
}

mapError = () => {
    // Error handling
    window.alert('Error Can not load Google map');
};
// Set markers to map
function setMarkers(map, location) {
    for (var i = 0, len = location.length; i < len; i++) {

        latlngset = new google.maps.LatLng(location[i].lat, location[i].long);

        var marker = new google.maps.Marker({
            map: map,
            title: location[i].name,
            position: latlngset,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        var bounds = new google.maps.LatLngBounds();
        for (var j = 0; j < markers.length; j++) {
            bounds.extend(markers[j].getPosition());
        }
        map.fitBounds(bounds);

        google.maps.event.addDomListener(window, 'resize', function() {
            map.fitBounds(bounds);
        });

        info(marker, location[i]);
    }
}

//Creates inforWindow for selected marker
function info(marker, location) {
    var wikiurl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&exchars=500&titles=" + location.name;
    var htmlWiki = "<div id='content'><h3>" + location.name + "</h3>";
    htmlWiki += '<img class="photoimg" alt="Google Street View picture is currently not available" src="https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + location.lat + ',' + location.long + '&heading=' + location.heading + '&pitch=' + location.pitch + '"><span>';
    // jsonp ajax request to get Wikipedia extract
    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        success: function(response) {
            var obj = response.query.pages;
            for (var prop in obj) {
                htmlWiki += obj[prop].extract + "</span><p>Source: <a href='https://en.wikipedia.org/w/index.php?title=" + name + "'>wikipedia</a></p></div>";
            }
            var content = htmlWiki;
            var infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });
            // marker click event
            google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map, marker);

                };
            })(marker, content, infowindow));
        }
    }).fail(function(jqXHR, textStatus) {
        // error handling
        window.alert('Error Can not load Wiki');
    });

    // marker click event
    marker.addListener('click', toggleBounce);

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 2000);
        }
    }
}

var viewModel = function() {
    // search variable
    this.query = ko.observable('');

    // filter functionality for Query
    this.SourceList = ko.computed(function() {
        search = this.query().toLowerCase();

        // filtering query
        var results = ko.utils.arrayFilter(locationsArray, function(point) {
            var isMatching = point.name.toLowerCase().indexOf(search) >= 0;
            var pos = point.name;
            if (isMatching) {
                // show markers here
                for (var i = 0, len = markers.length; i < len; i++) {
                    if (markers[i].title == pos) {
                        markers[i].setVisible(true);
                    }
                }
            } else {
                // Hide markers here
                for (var k = 0, foo = markers.length; k < foo; k++) {
                    if (markers[k].title == pos) {
                        markers[k].setVisible(false);
                    }
                }
            }
            return isMatching;
        });
        return results;
    }, this);

    // triggered by click event of left list section
    this.highlighPlace = function(Filteritem) {
        // Aadding animation to selected marker
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title == Filteritem.name) {
                if (markers[i].title == Filteritem.name) {
                    google.maps.event.trigger(markers[i], 'click');
                    // centering the clicked location
                    var panLocation = new google.maps.LatLng(Filteritem.lat, Filteritem.long);
                    map.panTo(panLocation);

                }
            }
        }
    };
};
// knockout binding
ko.applyBindings(new viewModel());
