const weeklyEntries = {
  monday: {},
  tuesday: {},
  wednesday: {},
  thursday: {},
  friday: {},
  saturday: {},
  sunday: {}
};

/* sample entry: {monday: {10-am: do work, 10-pm: no work}} */

const $addEntryButton = document.querySelector('#add-entry-button');
const $addEntryBox = document.querySelector('#add-entry');
const $entryForm = document.querySelector('#entry-form');

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
