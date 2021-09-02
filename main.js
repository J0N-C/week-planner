var weeklyEntries = {
  monday: {},
  tuesday: {},
  wednesday: {},
  thursday: {},
  friday: {},
  saturday: {},
  sunday: {}
};

window.addEventListener('beforeunload', function (event) {
  var weeklyEntriesJSON = JSON.stringify(weeklyEntries);
  localStorage.setItem('weekly-data', weeklyEntriesJSON);
});

var previousEntries = localStorage.getItem('weekly-data');
if (previousEntries !== null) {
  weeklyEntries = JSON.parse(previousEntries);
}

/* sample entry: {monday: {10-am: do work, 10-pm: no work}} */

const $addEntryButton = document.querySelector('#add-entry-button');
const $addEntryBox = document.querySelector('#add-entry');
const $entryForm = document.querySelector('#entry-form');
const $scheduleDay = document.querySelector('#days');
const $scheduleBody = document.querySelector('#schedule-body');

populateSchedule('monday');

$addEntryButton.addEventListener('click', function (event) {
  $addEntryBox.className = '';
  $entryForm.reset();
});

$entryForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const dayOfW = $entryForm.day.value;
  const hour = $entryForm.hour.value;
  weeklyEntries[dayOfW][hour] = $entryForm.entry.value;
  $addEntryBox.className = 'hidden';
});
/* Object.keys(objectName) to get array of keys of an object. */
/* function submitForm(event) {
  let currentEntry = null;
  event.preventDefault();
  if ($form.getAttribute('data-view') === 'entry-form') {
    const filledForm = {};
    filledForm.entryID = data.nextEntryId;
    filledForm.title = $form.title.value;
    filledForm.photourl = $form.photo.value;
    filledForm.notes = $form.notes.value;
    data.nextEntryId++;
    $form.reset();
    data.entries.push(filledForm);
    document.querySelector('#photo').setAttribute('src', 'images/placeholder-image-square.jpg');
    showEntries();
  } */

$scheduleDay.addEventListener('click', function (event) {
  if (event.target.nodeName !== 'BUTTON') return;
  const day = event.target.textContent;
  $scheduleBody.className = day.toLowerCase();
});

function blankSchedule(num) {
  for (let i = 0; i < num; i++) {
    const newRow = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    newRow.appendChild(col1);
    newRow.appendChild(col2);
    $scheduleBody.appendChild(newRow);
  }
}

function populateSchedule(day) {
  while ($scheduleBody.firstChild) {
    $scheduleBody.removeChild($scheduleBody.firstChild);
  }
  const entryKeys = Object.entries(weeklyEntries[day]);
  let morning = [];
  let afternoon = [];
  entryKeys.forEach(entry => {
    if (/AM/.test(entry[0])) {
      morning.push(entry);
    } else {
      afternoon.push(entry);
    }
  });
  morning = compareTime(morning);
  afternoon = compareTime(afternoon);
  const fullSchedule = morning.concat(afternoon);
  let addRows = fullSchedule.length;
  if (addRows < 8) {
    addRows = 8;
  }
  blankSchedule(addRows);
  for (let i = 0; i < fullSchedule.length; i++) {
    const $scheduleBodyNodes = $scheduleBody.querySelectorAll('tr');
    const dataNodes = ($scheduleBodyNodes[i].children);
    dataNodes[0].textContent = fullSchedule[i][0];
    dataNodes[1].textContent = fullSchedule[i][1];
  }
}
/* function for sorting an array of entry times keeping 12 as first entry */
function compareTime(timeArr) {
  return timeArr.sort((a, b) => {
    let intA = parseInt(a[0]);
    let intB = parseInt(b[0]);
    if (intA === 12) {
      intA = 0;
    }
    if (intB === 12) {
      intB = 0;
    }
    return intA - intB;
  });
}

/* Loop through entering all entries set up html elements. minimum 8 rows if 8 or less entries, else continue.
Set up a way to swap views for each day schedule. NOT className? */
/* <tbody id="schedule-body" class="monday">
          <tr>
            <td>
              Test time 10:00 AM
            </td>
            <td>
              Test entry do work
            </td>
          </tr>
          <tr>
            <td>
              Test time 11:00 AM
            </td>
            <td>
              Test entry do work
            </td>
          </tr>
          <tr>
            <td>
              Test time 12:00 PM
            </td>
            <td>
              Test entry do work
            </td>
          </tr>
        </tbody> */
