(function () {
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const today = new Date();
  const month = months[today.getMonth()];
  const day = today.getDate();
  const year = today.getFullYear();

  document.getElementById("current-date").textContent = `${month} ${day}, ${year}`;
})();