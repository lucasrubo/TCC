    let map, infoWindow;
    function initMap() {
        const styledMapType = new google.maps.StyledMapType(stylesArray);
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -22.925792615630975, lng: -47.037313460961876 },
            zoom: 15,
            // 1: mundo
            // 5: terra/continente
            // 10: cidade
            // 15: ruas
            // 20: construções
            mapTypeControlOptions: {
                mapTypeIds: [],
            },
        });

        var input = document.getElementById('searchInput');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    // The marker, positioned at Uluru
                    marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: 'Você esta aqui',
                        icon: '../images/patinha-map.png'
                    });
                    infowindow.setContent('<div><strong>Você esta aqui!</strong><br>');
                    infowindow.open(map, marker);
                    map.setCenter(pos);
                    document.getElementById("latitude_form").value = pos.lat;
                    document.getElementById("longitude_form").value = pos.lng;
                },
                () => {
                handleLocationError(true, infoWindow, map.getCenter());
                }
            );
            
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
    
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
            }
            
            marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: 'Você esta aqui',
                icon: '../images/patinha-map.png'
            });
        
            var address = '';
            if (place.address_components) {
                address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
        
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
            document.getElementById("latitude_form").value = marker.getPosition().lat()
            document.getElementById("longitude_form").value = marker.getPosition().lng();      
        });
        map.addListener('click', function(e){
            infowindow.close();
            marker.setMap(null);
            
            marker = new google.maps.Marker({
                position: e.latLng,
                map: map,
                title: 'Você esta aqui',
                icon: '../images/patinha-map.png'
            });
            infowindow.setContent('<div><strong>Você esta aqui!</strong><br>');
            infowindow.open(map, marker);
            // map.setCenter(e.latLng);
            document.getElementById("latitude_form").value = marker.getPosition().lat();
            document.getElementById("longitude_form").value = marker.getPosition().lng();
        });

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set("styled_map", styledMapType);
        map.setMapTypeId("styled_map");
    }
    
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
}

window.initMap = initMap;