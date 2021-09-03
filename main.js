/* data and localdata */
/* sample entry: {monday: {10:00 AM: 'do work', 10:00 PM: 'no work'}} */
/* will have to use bracket notation to pull values:
weeklyEntries.monday['10:00 AM'] === 'do work' */
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

const $addEntryButton = document.querySelector('#add-entry-button');
const $addEntryBox = document.querySelector('#add-entry');
const $entryForm = document.querySelector('#entry-form');
const $scheduleDay = document.querySelector('#days');
const $scheduleBody = document.querySelector('#schedule-body');
const $changeDay = document.querySelector('#change-day');

/* default schedule to monday */
populateSchedule('monday');

/* reveal new entry popup */
$addEntryButton.addEventListener('click', function (event) {
  $addEntryBox.className = '';
  $addEntryBox.querySelector('h2').textContent = 'Add Entry';
  $entryForm.reset();
});

/* close popup for new entry if click outside box */
$addEntryBox.addEventListener('mousedown', function (event) {
  if (event.target.id === 'add-entry') {
    $addEntryBox.className = 'hidden';
  }
});

/* submit entry, add entry to data list, and refresh schedule for day entered */
$entryForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const dayOfW = $entryForm.day.value;
  const hour = $entryForm.hour.value;
  weeklyEntries[dayOfW][hour] = $entryForm.entry.value;
  $addEntryBox.className = 'hidden';
  populateSchedule(dayOfW);
});

/* change schedule day */
$scheduleDay.addEventListener('click', function (event) {
  if (event.target.nodeName !== 'BUTTON') return;
  const day = event.target.getAttribute('data-day');
  populateSchedule(day);
  $scheduleBody.setAttribute('data-day', day.toLowerCase());
  $changeDay.textContent = day[0].toUpperCase() + day.slice(1);
});

/* for setup of a blank table with (num) rows */
function blankSchedule(num) {
  for (let i = 0; i < num; i++) {
    const newRow = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    const col3 = document.createElement('td');
    newRow.appendChild(col1);
    newRow.appendChild(col2);
    newRow.appendChild(col3);
    $scheduleBody.appendChild(newRow);
  }
}

/* populate table with entries */
/*
First removes all previous table data rows then sets up new one
Object.keys(objectName) to get array of keys of an object.
Object.tentries(objectName) to get array of key-value pairs
*/
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
    addEditButton(dataNodes[2]);
  }
}

/* function for sorting an array of entry times keeping 12:00 as first entry
sort format from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort:

let numbers = [4, 2, 5, 1, 3];
numbers.sort((a, b) => a - b);
console.log(numbers);
returns [1, 2, 3, 4, 5]

assume timeArr format array of an array of key-value pairs:
[[12:00 AM, description], [1:00 AM, description], [2:00 AM, description]]
*/
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

/* add udpate button to entries */
function addEditButton(node) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Update';
  editButton.className = 'button edit-button center-buttons';
  node.appendChild(editButton);
}

/* opens update entry popup */
$scheduleBody.addEventListener('click', function (event) {
  if (event.target.nodeName !== 'BUTTON') return;
  const childData = event.target.closest('tr').children;
  $addEntryBox.className = '';
  $addEntryBox.querySelector('h2').textContent = 'Edit Entry';
  $entryForm.day.value = $scheduleBody.getAttribute('data-day');
  $entryForm.hour.value = childData[0].textContent;
  $entryForm.entry.value = childData[1].textContent;
});

/* example table setup reference */
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
