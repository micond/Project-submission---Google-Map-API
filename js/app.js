// var map, infowindow, bounds;
// var markersArray = [];
var markers = [];
// var infoWindowElement = null;
var SourceArray = [{
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
    setMarkers(map, SourceArray);
};

function setMarkers(map, location) {
    for (i = 0; i < location.length; i++) {

        latlngset = new google.maps.LatLng(location[i].lat, location[i].long);

        var marker = new google.maps.Marker({
            map: map,
            title: location[i].name,
            position: latlngset
        });

        markers.push(marker);
        // markers always fit on screen as user resizes their browser window
        map.setCenter(marker.getPosition());
        google.maps.event.addDomListener(window, 'resize', function() {
            map.fitBounds(bounds);
        });

        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);

        info(marker, location[i])
    }
};

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
            };

            var content = htmlWiki

            var infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });

            google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                };
            })(marker, content, infowindow));
        }
    }).done(function(data) {
        // successful
    }).fail(function(jqXHR, textStatus) {
        // error handling
        window.alert('Error Can not load Wiki');
    });
};

var viewModel = function() {
    // search variable
    this.query = ko.observable('');

    // filter functionality for Query
    this.SourceList = ko.computed(function() {
        search = this.query().toLowerCase();

        // filtering query
        var results = ko.utils.arrayFilter(SourceArray, function(point) {
            return point.name.toLowerCase().indexOf(search) >= 0;
        });

        return results;
    }, this);

    // triggered by click event of left list section
    this.highlighPlace = function(Filteritem) {

        // Aadding animation to selected marker + removing animation from non-selected items
        for (var i = 0; i < markers.length; i++) {

            if (markers[i].title == Filteritem.name) {
                markers[i].setMap(map);
                markers[i].setAnimation(null);
                if (markers[i].title == Filteritem.name) {

                    google.maps.event.trigger(markers[i], 'click');

                    // centering the clicked location
                    var panLocation = new google.maps.LatLng(Filteritem.lat, Filteritem.long);
                    map.panTo(panLocation);

                    // bounce effect for 4 seconds
                    var tempMarker = markers[i];
                    tempMarker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        tempMarker.setAnimation(null);
                    }, 1400);

                }

            } else {
                markers[i].setMap(null);
            }

        }
    };

};

// knockout binding
ko.applyBindings(new viewModel());
