// /* ======= Model ======= */
// // Create a styles array to use with the map. (styles used from https://snazzymaps.com/style/70/unsaturated-browns)
//
// // The GeocoderRequest object literal contains the following fields:
//
// {
//  address: string,
//  location: LatLng,
//  placeId: string,
//  bounds: LatLngBounds,
//  componentRestrictions: GeocoderComponentRestrictions,
//  region: string
// }
//
// // The GeocoderResult object represents a single geocoding result. A geocode request may return multiple result objects:
//
// results[]: {
//  types[]: string,
//  formatted_address: string,
//  address_components[]: {
//    short_name: string,
//    long_name: string,
//    postcode_localities[]: string,
//    types[]: string
//  },
//  partial_match: boolean,
//  place_id: string,
//  postcode_localities[]: string,
//  geometry: {
//    location: LatLng,
//    location_type: GeocoderLocationType
//    viewport: LatLngBounds,
//    bounds: LatLngBounds
//  }
// }



var map_styles = [{
    "elementType": "geometry",
    "stylers": [{
        "hue": "#ff4400"
    }, {
        "saturation": -68
    }, {
        "lightness": -4
    }, {
        "gamma": 0.72
    }]
}, {
    "featureType": "road",
    "elementType": "labels.icon"
}, {
    "featureType": "landscape.man_made",
    "elementType": "geometry",
    "stylers": [{
        "hue": "#0077ff"
    }, {
        "gamma": 3.1
    }]
}, {
    "featureType": "water",
    "stylers": [{
        "hue": "#00ccff"
    }, {
        "gamma": 0.44
    }, {
        "saturation": -33
    }]
}, {
    "featureType": "poi.park",
    "stylers": [{
        "hue": "#44ff00"
    }, {
        "saturation": -23
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
        "hue": "#007fff"
    }, {
        "gamma": 0.77
    }, {
        "saturation": 65
    }, {
        "lightness": 99
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "gamma": 0.11
    }, {
        "weight": 5.6
    }, {
        "saturation": 99
    }, {
        "hue": "#0091ff"
    }, {
        "lightness": -86
    }]
}, {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
        "lightness": -48
    }, {
        "hue": "#ff5e00"
    }, {
        "gamma": 1.2
    }, {
        "saturation": -23
    }]
}, {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [{
        "saturation": -64
    }, {
        "hue": "#ff9100"
    }, {
        "lightness": 16
    }, {
        "gamma": 0.47
    }, {
        "weight": 2.7
    }]
}];
