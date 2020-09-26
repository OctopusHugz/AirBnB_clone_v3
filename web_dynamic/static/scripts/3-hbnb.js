const $ = window.$;
const amenityDict = {};
const titleString = '<article><div class="title_box"><h2></h2><div class="price_by_night"></div></div>';
const infoString = '<div class="information"><div class="max_guest"></div><div class="number_rooms"></div><div class="number_bathrooms"></div></div>';
const descString = '<div class="description"></div></article>';
const htmlString = titleString + infoString + descString;
$(document).ready(function () {
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({ body: {} }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      data.forEach((place) => {
        $(htmlString).appendTo('section.places');
        $('.title_box h2').last().html(place.name);
        $('.title_box .price_by_night')
          .last()
          .html('$' + place.price_by_night);
        $('.information .max_guest')
          .last()
          .html(place.max_guest + ' Guests');
        $('.information .number_rooms')
          .last()
          .html(place.number_rooms + ' Rooms');
        $('.information .number_bathrooms')
          .last()
          .html(place.number_bathrooms + ' Bathrooms');
        $('.description').last().html(place.description);
      });
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
