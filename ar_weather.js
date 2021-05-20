let coordinates = {};
let weather,name;

$(document).ready(function(){
    get_coordinates();
    render_element();
});

function get_coordinates(){
    let searchParams = new URLSearchParams(window.location.search);

    if(searchParams.has('source')&& searchParams.has('destination')){
        let source = searchParams.get('source');
        let destination = searchParams.get('destination');

        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lng = source.split(";")[1]

        coordinates.destination_lat = destination.split(";")[0];
        coordinates.destination_lng = destination.split(";")[1];
    }else{
        alert("coordinates not found!");
        window.history.back;
    }
}

function render_element(){
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.destination_lat}&lon=${coordinates.destination_lng}&appid=41326f5c781686e9dc60dc22f287eb8d`,
        type: "get",
        success: function (response){
            wname = response.name;
            weather = response.weather[0].description
            console.log(weather)
            console.log(wname)
        }
    });
    $.ajax({
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lng}%2C${coordinates.source_lat}%3B${coordinates.destination_lng}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
        type: "get",
        success: function(response){
            let steps = response.routes[0].legs[0].steps
            console.log(steps)
            for(let i=0;i<steps.lenght;i++){
                $("#scene-container").append(
                    `
                    <a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                        <a-entity>
                            <a-text height="50" value:"Weather forecast is ${weather} at ${wname}"></a-text>
                        </a-entity>
                    </a-entity>
                    `
                )
            }
        }
    })
}