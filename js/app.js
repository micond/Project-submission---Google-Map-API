var Sightseeing = (function() {

    var model = {
        map: null,

        // initialization of google maps api
        init: function() {
            map = new google.maps.Map(document.getElementById("map"), {
                center: new google.maps.LatLng(48.143506, 17.105588),
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.roadmap,
                styles: map_styles
            });


        },

        // rendering functionality
        point: function(name, lat, long, heading, pitch) {
            this.name = name;
            this.lat = ko.observable(lat);
            this.long = ko.observable(long);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, long),
                title: name,
                map: map
            });

            markersArray.push(marker);

            // Extend the boundaries of the map for each marker and display the marker
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < markersArray.length; i++) {
                bounds.extend(markersArray[i].getPosition());
            };
            map.fitBounds(bounds);

            // marker click event with wiki API
            google.maps.event.addListener(marker, 'click', function() {

                var WikiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&exchars=500&titles=" + name;
                var htmlWiki = "<div id='content'><h3>" + name + "</h3>";
                htmlWiki += '<img class="photoimg" alt="Google Street View picture is currently not available" src="https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + lat + ',' + long + '&heading=' + heading + '&pitch=' + pitch + '"><span>';

                // error handling for wikipedia request
                var wikiRequestTimeout = setTimeout(function() {
                    htmlWiki += "Request of wikipedia resouces failed.</span></p></div>";
                    var infowindow = new google.maps.InfoWindow({
                        content: htmlWiki,
                        maxWidth: 300
                    });
                    infowindow.open(map, marker);
                }, 3000);

                // jsonp ajax request to get Wikipedia data
                $.ajax({
                    url: WikiUrl,
                    dataType: "jsonp",
                    success: function(response) {
                        var obj = response.query.pages;
                        for (var prop in obj) {
                            htmlWiki += obj[prop].extract + "</span><p>Source: <a href='https://en.wikipedia.org/w/index.php?title=" + name + "'>wikipedia</a></p></div>";
                        }

                        // removing animation from non-selected items
                        for (var i = 0; i < markersArray.length; i++) {
                            markersArray[i].setAnimation(null);
                        }

                        // removing infowindow from non-active item
                        if (!$.isEmptyObject(infoWindowElement)) {
                            infoWindowElement.close();
                        }

                        // infowindow functionality
                        var infowindow = new google.maps.InfoWindow({
                            content: htmlWiki,
                            maxWidth: 300
                        });
                        infowindow.open(map, marker);
                        infoWindowElement = infowindow;

                        // bounce effect lasting 3 seconds
                        var tempMarker = marker;
                        tempMarker.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(function() {
                            tempMarker.setAnimation(null);
                        }, 3000);

                        // wikipedia error handling
                        clearTimeout(wikiRequestTimeout);
                    }
                });
            });
        }


    };

    var viewModel = function() {

        // source array of map point elements
        this.SourceArray = [{
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
                pitch: 21.9
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



        // search variable
        this.query = ko.observable('');

        // filter functionality for Query
        this.SourceList = ko.dependentObservable(function() {
            search = this.query().toLowerCase();

            // clearing all markers in Array
            for (var i in markersArray) {
                markersArray[i].setMap(null);
            }
            markersArray = [];

            // filtering query
            var results = ko.utils.arrayFilter(this.SourceArray, function(point) {
                return point.name.toLowerCase().indexOf(search) >= 0;
            });

            // Looping through result set and setting markers
            results.forEach(function(Filteritem) {
                new model.point(Filteritem.name, Filteritem.lat, Filteritem.long, Filteritem.heading, Filteritem.pitch);
            });

            return results;
        }, this);

        // triggered by click event of left list section
        this.highlighPlace = function(Filteritem) {
            // animating markers
            for (var i = 0; i < markersArray.length; i++) {

                // removing animation from non-selected items
                markersArray[i].setAnimation(null);
                if (markersArray[i].title == Filteritem.name) {

                    // centering the clicked location
                    var panLocation = new google.maps.LatLng(Filteritem.lat, Filteritem.long);
                    map.panTo(panLocation);


                    // bounce effect for 4 seconds
                    var tempMarker = markersArray[i];
                    tempMarker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        tempMarker.setAnimation(null);
                    });
                }
            }
        };

    };

    // Initialization
    model.init();
    // as per google: markersArray set to global variable for clearing purposes
    // https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    var markersArray = [];
    var markers = [];
    // last open InfoWindow element
    var infoWindowElement = null;
    // knockout binding
    ko.applyBindings(new viewModel());

})();
