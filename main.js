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
/* save data to localstorage on close */
window.addEventListener('beforeunload', function (event) {
  var weeklyEntriesJSON = JSON.stringify(weeklyEntries);
  localStorage.setItem('weekly-data', weeklyEntriesJSON);
});
/* load data on new page */
var previousEntries = localStorage.getItem('weekly-data');
if (previousEntries !== null) {
  weeklyEntries = JSON.parse(previousEntries);
}

/* variable declarations */
const $addEntryButton = document.querySelector('#add-entry-button');
const $addEntryBox = document.querySelector('#add-entry');
const $entryForm = document.querySelector('#entry-form');
const $scheduleDay = document.querySelector('#days');
const $scheduleBody = document.querySelector('#schedule-body');
const $changeDay = document.querySelector('#change-day');
const $deleteEntryBox = document.querySelector('#delete-entry-box');
const $cancelDelete = document.querySelector('#cancel-delete');
const $confirmDelete = document.querySelector('#delete');

/* default schedule to monday on new page/refresh */
populateSchedule('monday');

/* reveal new entry popup modal */
$addEntryButton.addEventListener('click', function (event) {
  $addEntryBox.className = '';
  $addEntryBox.querySelector('h2').textContent = 'Add Entry';
  $entryForm.reset();
});

/* close popup for new or delete entry, if clicked outside modal box */
window.addEventListener('mousedown', function (event) {
  if (event.target.id === 'add-entry') {
    $addEntryBox.className = 'hidden';
  }
  if (event.target.id === 'delete-entry-box') {
    $deleteEntryBox.className = 'hidden';
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

/* change schedule day displayed */
$scheduleDay.addEventListener('click', function (event) {
  if (event.target.nodeName !== 'BUTTON') return;
  const day = event.target.getAttribute('data-day');
  populateSchedule(day);
  $scheduleBody.setAttribute('data-day', day.toLowerCase());
  $changeDay.textContent = day[0].toUpperCase() + day.slice(1);
});

/* for setup of a blank table with (num) rows, 3 columnns: time, text, edit/delete buttons */
function blankSchedule(num) {
  for (let i = 0; i < num; i++) {
    const newRow = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    const col3 = document.createElement('td');
    col3.className = 'center-buttons';
    newRow.appendChild(col1);
    newRow.appendChild(col2);
    newRow.appendChild(col3);
    $scheduleBody.appendChild(newRow);
  }
}

/* populate table with entry time, description, editing buttons */
/*
Object.keys(objectName) to get array of keys of an object.
Object.entries(objectName) to get array of key-value pairs
*/
function populateSchedule(day) {
  /* loop to delete all previous nodes */
  while ($scheduleBody.firstChild) {
    $scheduleBody.removeChild($scheduleBody.firstChild);
  }
  /* split times into AM/PM, then sort by descending and concat */
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
  /* Add number of rows to table as needed and populate, min. 8 rows */
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

assume timeArr format array in array:
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

/* add udpate and delete buttons only to entries, onto specified node */
function addEditButton(node) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Update';
  editButton.className = 'button edit-button';
  node.appendChild(editButton);
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'button delete-button';
  node.appendChild(deleteButton);
}

/* opens update entry or delete entry popup */
$scheduleBody.addEventListener('click', function (event) {
  /* if user did not click button, do nothing */
  if (event.target.nodeName !== 'BUTTON') return;
  /* if update is clicked, open pre-populated new entry box */
  if (event.target.classList.contains('edit-button')) {
    const childData = event.target.closest('tr').children;
    $addEntryBox.className = '';
    $addEntryBox.querySelector('h2').textContent = 'Edit Entry';
    $entryForm.day.value = $scheduleBody.getAttribute('data-day');
    $entryForm.hour.value = childData[0].textContent;
    $entryForm.entry.value = childData[1].textContent;
  }
  /* if delete is clicked, open confirmation */
  if (event.target.classList.contains('delete-button')) {
    $deleteEntryBox.className = '';
    const deleteTargetDay = $scheduleBody.getAttribute('data-day');
    const deleteTargetHour = event.target.closest('tr').children[0].textContent;
    /* cancel delete, close confirmation */
    $cancelDelete.addEventListener('click', function (event) {
      $deleteEntryBox.className = 'hidden';
    });
    /* confirm delete, remove property from entries object, repopulate table, close confirmation */
    $confirmDelete.addEventListener('click', function (event) {
      delete weeklyEntries[deleteTargetDay][deleteTargetHour];
      populateSchedule(deleteTargetDay);
      $deleteEntryBox.className = 'hidden';
    });
  }
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
