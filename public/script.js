
var STORAGE_ID = 'weatherapp';

var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(weather));
}
var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}



var fetch = function () {
    var input = $('.city-name').val();
    $.ajax({
        method: "GET",
        url: 'http://api.apixu.com/v1/current.json?key=8b8e0883a91f4e5d8ce91347180701&q=' + input,

        success: function (data) {
            if (input.toUpperCase() === data.location.name.toUpperCase()) {
                renderWeather(data);
                return;
            } else if (input !== data.location.name) {
                $('.display-weather').empty();
                $('.display-weather').append("please enter a valid city name");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            $('.display-weather').empty();
            $('.display-weather').append("please enter a valid city name");

        }
    });
};

var idNum = 0;
var weather = [];
function renderWeather(data) {
    $('.display-weather').empty();

    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);

    var toDisplay = {

        city: data.location.name ? data.location.name : "info unavailable",
        tempCelc: data.current.temp_c ? data.current.temp_c : "info unavailable",
        tempFar: data.current.temp_f ? data.current.temp_f : "info unavailable",
        time: data.location.localtime ? data.location.localtime : "info unavailable",
        comments: []
    };

    weather.push(toDisplay);
    for(var i = 0; i < weather.length; i++){
        var newHTML = template(weather[i]);
        // append our new html to the page
        $('.display-weather').append(newHTML);
    }
  
    $('.city-title').append('<button class="trash"><i class="fa fa-trash"></i></button>');

    saveToLocalStorage();
}


//click functions

$('.get-weather').on('click', fetch);

$('.display-weather').on('click', '.leave-comment', function () {
    var comText = $('.comment-input').val();
    $(this).closest('.display-weather').find('.show-comments').append(comText + '<br>');
    for(var i = 0; i < weather.length; i++){
    weather[i].comments.push({text: comText , id: idNum++});
    saveToLocalStorage();
    }
    $('.comment-input').val("");

});


$('.display-weather').on('click', '.trash', function () {
   var index = $(this).closest('.list').index();
   console.log(index);
   weather.splice(index, 1);
   $(this).closest('.list').remove();

});

