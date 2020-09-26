const $ = window.$;
const amenityDict = {};
const stateDict = {};
const cityDict = {};
const titleString = '<article><div class="title_box"><h2></h2><div class="price_by_night"></div></div>';
const infoString = '<div class="information"><div class="max_guest"></div><div class="number_rooms"></div><div class="number_bathrooms"></div></div>';
const descString = '<div class="description"></div></article>';
const htmlString = titleString + infoString + descString;
$(document).ready(function () {
  // get request for API to show if API is running or not
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  // post request to populate all places on the landing page
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({ body: {} }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (response) {
      response.forEach((place) => {
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
  // listens to amenities checkboxes and populates amenities filter
  $('.amenities li input').click(function () {
    if (this.checked) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    printFunc(amenityDict);
  });
  // listens to state checkboxes and populates state filter
  $('.state').click(function () {
    if (this.checked) {
      stateDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete stateDict[$(this).attr('data-id')];
    }
    printFunc(stateDict);
  });
  // listens to city checkboxes and populates cities filter
  $('.city').click(function () {
    if (this.checked) {
      cityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cityDict[$(this).attr('data-id')];
    }
    if (Object.keys(stateDict).length === 0) {
      printFunc(cityDict);
    }
  });
  // post request if button is clicked to filter place results
  $('button').click(function () {
    const amenityDictKeys = Object.keys(amenityDict);
    const stateDictKeys = Object.keys(stateDict);
    const cityDictKeys = Object.keys(cityDict);
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({
        amenities: amenityDictKeys,
        states: stateDictKeys,
        cities: cityDictKeys
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        $('section.places').empty();
        response.forEach((place) => {
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
  });
});

function printFunc (dictionary) {
  let elementName = '.locations h4';
  if (dictionary === amenityDict) {
    elementName = '.amenities h4';
  }
  $(elementName).empty();
  const dictKeys = Object.keys(dictionary);
  const dictLength = dictKeys.length;
  dictKeys.forEach(function (key, index) {
    $(elementName).append(dictionary[key]);
    if (index !== dictLength - 1) {
      $(elementName).append(', ');
    }
  });
  if (dictLength === 0) {
    $(elementName).append('&nbsp;');
    if (dictionary === stateDict) {
      $('.locations h3').html('Cities');
      printFunc(cityDict);
    }
    if (dictionary === cityDict) {
      $('.locations h3').html('States');
    }
  }
}
