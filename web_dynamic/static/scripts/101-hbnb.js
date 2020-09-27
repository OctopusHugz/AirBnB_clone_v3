const $ = window.$;
const amenityDict = {};
const stateDict = {};
const cityDict = {};
const titleString = '<article><div class="title_box"><h2></h2><div class="price_by_night"></div></div>';
const infoString = '<div class="information"><div class="max_guest"></div><div class="number_rooms"></div><div class="number_bathrooms"></div></div>';
const descString = '<div class="description"></div>';
const dataNoKeys = JSON.stringify({ body: {} });
let userName = '';
$(document).ready(function () {
  placesSearch(dataNoKeys);
  apiStatus();
  filterListeners();
  searchListener();
});

function placesSearch (data) {
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data,
    dataType: 'json',
    contentType: 'application/json',
    success: function (response) {
      $('section.places').empty();
      response.forEach(async (place) => {
        const reviewPlaceID = 'review_place_' + place.id;
        const reviewString =
          '<div id="' +
          reviewPlaceID +
          '" class="review_place"></div></article>';
        const htmlString = titleString + infoString + descString + reviewString;
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
        const reviewUrl =
          'http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews';
        const reviewListID = 'review_list_' + place.id;
        const outerHTML =
          '<h2>Reviews</h2><span class="hide">Show</span>' +
          '<ul id="' +
          reviewListID +
          '"></ul>';
        $(outerHTML).appendTo('#' + reviewPlaceID);
        $('#' + reviewPlaceID + ' span').click(function () {
          if ($(this).hasClass('hide')) {
            $.getJSON(reviewUrl, function (response) {
              response.forEach((review) => {
                const rawDateString = review.created_at.substring(0, 10);
                const yearString = rawDateString.substring(0, 4);
                const monthString = rawDateString.substring(5, 7);
                const dayString = rawDateString.substring(8, 10);
                const month = getMonth(monthString);
                const reviewTitleString = '';
                const innerHTML = '';
                // Can we define the vars above at the top of script so they can be removed from function prototype?
                setUserName(
                  review,
                  review.user_id,
                  reviewTitleString,
                  dayString,
                  month,
                  yearString,
                  innerHTML,
                  reviewListID
                );
              });
            });
            $(this).removeClass('hide').addClass('show');
            $(this).html('Hide');
          } else {
            $(this).removeClass('show').addClass('hide');
            $(this).html('Show');
            $('ul#' + reviewListID).empty();
          }
        });
      });
    }
  });
}

function fillElementWith (dictionary) {
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
      fillElementWith(cityDict);
    }
    if (dictionary === cityDict) {
      $('.locations h3').html('States');
    }
  }
}

function apiStatus () {
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}

function filterListeners () {
  // listens to amenities checkboxes and populates amenities filter
  $('.amenity').click(function () {
    if (this.checked) {
      amenityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityDict[$(this).attr('data-id')];
    }
    fillElementWith(amenityDict);
  });
  // listens to state checkboxes and populates state filter
  $('.state').click(function () {
    if (this.checked) {
      stateDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete stateDict[$(this).attr('data-id')];
    }
    fillElementWith(stateDict);
  });
  // listens to city checkboxes and populates cities filter
  $('.city').click(function () {
    if (this.checked) {
      cityDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cityDict[$(this).attr('data-id')];
    }
    if (Object.keys(stateDict).length === 0) {
      fillElementWith(cityDict);
    }
  });
}

function searchListener () {
  $('button').click(function () {
    const amenityDictKeys = Object.keys(amenityDict);
    const stateDictKeys = Object.keys(stateDict);
    const cityDictKeys = Object.keys(cityDict);
    const dataWithKeys = JSON.stringify({
      amenities: amenityDictKeys,
      states: stateDictKeys,
      cities: cityDictKeys
    });
    placesSearch(dataWithKeys);
  });
}

function getMonth (monthString) {
  switch (monthString) {
    case '01':
      return 'January';
    case '02':
      return 'February';
    case '03':
      return 'March';
    case '04':
      return 'April';
    case '05':
      return 'May';
    case '06':
      return 'June';
    case '07':
      return 'July';
    case '08':
      return 'August';
    case '09':
      return 'September';
    case '10':
      return 'October';
    case '11':
      return 'November';
    case '12':
      return 'December';
  }
}

function getUserName (
  review,
  userID,
  reviewTitleString,
  dayString,
  month,
  yearString,
  innerHTML,
  reviewListID
) {
  return new Promise((resolve) => {
    $.getJSON('http://0.0.0.0:5001/api/v1/users/' + userID, function (
      response
    ) {
      userName = response.first_name + ' ' + response.last_name;
      reviewTitleString =
        'From ' +
        userName +
        ' the ' +
        dayString +
        'th ' +
        month +
        ' ' +
        yearString;
      innerHTML =
        '<li><h3>' +
        reviewTitleString +
        '</h3><p class="review_text">' +
        review.text +
        '</p></li>';
      $(innerHTML).appendTo('ul#' + reviewListID);
      resolve(response);
    });
  });
}

async function setUserName (
  review,
  userID,
  reviewTitleString,
  dayString,
  month,
  yearString,
  innerHTML,
  reviewListID
) {
  await getUserName(
    review,
    userID,
    reviewTitleString,
    dayString,
    month,
    yearString,
    innerHTML,
    reviewListID
  );
}
