/* ==============================================
   SMOKE AT THE WATER – events.js
   Loads events from Supabase and renders them
   ============================================== */

'use strict';

var SUPABASE_URL  = 'https://eqcmfjkhqbihgvdebnuy.supabase.co';
var SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxY21mamtocWJpaGd2ZGVibnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjcwOTcsImV4cCI6MjA5MTUwMzA5N30.FbEZ6R15JiDUk8ORRWCtzZNq01I1jbc7hwWg9vyAjSg';

var EVENT_TYPE_LABELS = {
  live_musik:      'Live-Musik',
  public_viewing:  'Public Viewing',
  special:         'Special'
};

var EVENT_TYPE_EMOJI = {
  live_musik:      '\uD83C\uDFB5',
  public_viewing:  '\u26BD',
  special:         '\u2728'
};

function getTodayString() {
  var now = new Date();
  var parts = new Intl.DateTimeFormat('en', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    timeZone: 'Europe/Berlin'
  }).formatToParts(now);
  var y = parts.find(function(p) { return p.type === 'year'; }).value;
  var m = parts.find(function(p) { return p.type === 'month'; }).value;
  var d = parts.find(function(p) { return p.type === 'day'; }).value;
  return y + '-' + m + '-' + d;
}

function formatEventDate(dateStr) {
  var date = new Date(dateStr + 'T12:00:00');
  return {
    day:     new Intl.DateTimeFormat('de-DE', { day: 'numeric', timeZone: 'Europe/Berlin' }).format(date),
    month:   new Intl.DateTimeFormat('de-DE', { month: 'long', timeZone: 'Europe/Berlin' }).format(date),
    year:    new Intl.DateTimeFormat('de-DE', { year: 'numeric', timeZone: 'Europe/Berlin' }).format(date),
    weekday: new Intl.DateTimeFormat('de-DE', { weekday: 'long', timeZone: 'Europe/Berlin' }).format(date)
  };
}

function formatTime(timeStr) {
  return timeStr.slice(0, 5);
}

function el(tag, className, textContent) {
  var node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent) node.textContent = textContent;
  return node;
}

function createEventCard(event) {
  var d = formatEventDate(event.event_date);
  var typeLabel = EVENT_TYPE_LABELS[event.event_type] || 'Event';
  var typeEmoji = EVENT_TYPE_EMOJI[event.event_type] || '\uD83C\uDF89';

  var timeText = formatTime(event.start_time) + ' Uhr';
  if (event.end_time) {
    timeText = formatTime(event.start_time) + ' \u2013 ' + formatTime(event.end_time) + ' Uhr';
  }

  var card = el('div', 'event-card reveal is-visible');

  // Date badge
  var dateBadge = el('div', 'event-card__date');
  dateBadge.appendChild(el('span', 'event-card__day', d.day));
  dateBadge.appendChild(el('span', 'event-card__month', d.month + ' ' + d.year));
  card.appendChild(dateBadge);

  // Info section
  var info = el('div', 'event-card__info');

  var badge = el('span', 'event-type-badge event-type-badge--' + event.event_type,
    typeEmoji + ' ' + typeLabel);
  info.appendChild(badge);

  info.appendChild(el('h3', null, event.title));

  if (event.description) {
    info.appendChild(el('p', null, event.description));
  }

  var meta = el('div', 'event-card__meta');
  meta.appendChild(el('span', null, '\uD83D\uDCC5 ' + d.weekday + ', ' + d.day + '. ' + d.month + ' ' + d.year));
  meta.appendChild(el('span', null, '\u23F0 ' + timeText));
  meta.appendChild(el('span', null, '\uD83D\uDCCD Zippendorfer Strand, Schwerin'));
  info.appendChild(meta);

  card.appendChild(info);
  return card;
}

function createEmptyState() {
  var container = el('div', 'events-empty reveal is-visible');
  container.appendChild(el('div', 'events-empty__icon', '\uD83C\uDFB6'));
  container.appendChild(el('h3', null, 'Keine anstehenden Events'));
  container.appendChild(el('p', null,
    'Schau bald wieder vorbei \u2013 wir planen regelm\u00E4\u00DFig Live-Musik, Public Viewing und mehr!'));

  var followP = el('p', null, 'Folge uns auf ');
  var link = document.createElement('a');
  link.href = 'https://instagram.com/smoke_at_the_water/';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Instagram';
  followP.appendChild(link);
  followP.appendChild(document.createTextNode(' f\u00FCr Updates.'));
  container.appendChild(followP);

  return container;
}

function createErrorState() {
  var container = el('div', 'events-empty reveal is-visible');
  container.appendChild(el('div', 'events-empty__icon', '\u26A0\uFE0F'));
  container.appendChild(el('h3', null, 'Events konnten nicht geladen werden'));

  var retryP = el('p', null, 'Bitte versuche es sp\u00E4ter erneut oder folge uns auf ');
  var link = document.createElement('a');
  link.href = 'https://instagram.com/smoke_at_the_water/';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Instagram';
  retryP.appendChild(link);
  retryP.appendChild(document.createTextNode('.'));
  container.appendChild(retryP);

  return container;
}

function updateStructuredData(events) {
  var existing = document.getElementById('events-jsonld');
  if (existing) existing.remove();
  if (!events.length) return;

  var items = events.map(function(event) {
    var item = {
      '@type': 'Event',
      'name': event.title,
      'description': event.description || '',
      'startDate': event.event_date + 'T' + event.start_time,
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'location': {
        '@type': 'Place',
        'name': 'Smoke at the Water',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Am Strand 5a',
          'addressLocality': 'Schwerin',
          'postalCode': '19063',
          'addressCountry': 'DE'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 53.6025554,
          'longitude': 11.4539735
        }
      },
      'organizer': {
        '@type': 'FoodEstablishment',
        'name': 'Smoke at the Water',
        'url': 'https://smokeatthewater.de'
      }
    };
    if (event.end_time) {
      item.endDate = event.event_date + 'T' + event.end_time;
    }
    return item;
  });

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'events-jsonld';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': items });
  document.head.appendChild(script);
}

(function loadEvents() {
  var container = document.getElementById('events-container');
  var loader    = document.getElementById('events-loader');
  if (!container) return;

  var today = getTodayString();
  var url = SUPABASE_URL + '/rest/v1/events' +
    '?is_published=eq.true' +
    '&event_date=gte.' + today +
    '&order=event_date.asc,start_time.asc' +
    '&select=*';

  fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  })
  .then(function(res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .then(function(events) {
    if (loader) loader.remove();

    if (!events.length) {
      container.appendChild(createEmptyState());
      return;
    }

    // Naechstes Event hervorheben
    var nextEvent = events[0];
    var nextSection = document.getElementById('next-event-section');
    var nextTitle = document.getElementById('next-event-title');
    if (nextSection && nextTitle) {
      nextTitle.textContent = nextEvent.title;
      nextSection.textContent = '';
      nextSection.appendChild(createEventCard(nextEvent));
    }

    // Alle weiteren Events
    events.slice(1).forEach(function(event) {
      container.appendChild(createEventCard(event));
    });

    if (events.length <= 1) {
      var furtherSection = container.closest('.section');
      if (furtherSection) furtherSection.style.display = 'none';
    }

    updateStructuredData(events);
  })
  .catch(function() {
    if (loader) loader.remove();
    container.appendChild(createErrorState());
  });
})();
