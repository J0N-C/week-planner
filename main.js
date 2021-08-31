const weeklyEntries = {
  monday: {},
  tuesday: {},
  wednesday: {},
  thursday: {},
  friday: {},
  saturday: {},
  sunday: {}
};
/* sample entry: {monday: {morning: true, 10: do work}} */
const $addEntryButton = document.querySelector('#add-entry-button');
const $addEntryBox = document.querySelector('#add-entry');
const $saveEntryButton = document.querySelector('#save-entry');
const $entryForm = document.querySelector('#entry-form');

$addEntryButton.addEventListener('click', function (event) {
  $addEntryBox.className = '';
  $entryForm.reset();

});

$saveEntryButton.addEventListener('click', function (event) {
  event.preventDefault();
  weeklyEntries.monday.morning = true;
  $addEntryBox.className = 'hidden';
});
