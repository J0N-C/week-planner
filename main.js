const $addEntryButton = document.querySelector('#add-entry-button');
const $addEntryBox = document.querySelector('#add-entry');
const $saveEntryButton = document.querySelector('#save-entry');

$addEntryButton.addEventListener('click', function (event) {
  $addEntryBox.className = '';
});

$saveEntryButton.addEventListener('click', function (event) {
  $addEntryBox.className = 'hidden';
});
