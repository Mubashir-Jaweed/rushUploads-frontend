// Simulate ad injection
console.log('Ad script loaded!');
document.querySelectorAll('[id^="upload-"], [id^="support-"], [id^="home-"], [id^="prev-"]')
  .forEach((slot) => {
    slot.innerHTML = '<div class="test-ad">Test Ad</div>';
  });