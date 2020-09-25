const $ = window.$;
const amenityDict = {};
$(document).ready(function () {
  $.post('http://0.0.0.0:5001/api/v1/places_search/', 
	 {
	     Content-Type: 'application/json';
	     Body: {};
	 },
	 function (data, status) {
	     data.forEach (place) => {
		 console.log(place);
		 $('<article></article>').appendTo('section.places');
		 $('<div class="title_box"></div>').appendTo('article');
		 $('<h2></h2>').appendTo('.title_box');
		 $('h2').append(place.name);
		 $('<div class="price_by_night"></div>').appendTo('.title_box');
		 $('.price_by_night').append(place.price_by_night);		 
	     }
	 }
	});
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $('li input').click(function () {
    if (this.checked) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    $('.amenities h4').empty();
    const amenityDictKeys = Object.keys(amenityDict);
    const amenityDictLength = amenityDictKeys.length;
    amenityDictKeys.forEach(function (key, index) {
      $('.amenities h4').append(amenityDict[key]);
      if (index !== amenityDictLength - 1) {
        $('.amenities h4').append(', ');
      }
    });
    if (amenityDictLength === 0) {
      $('.amenities h4').append('&nbsp;');
    }
  });
});
