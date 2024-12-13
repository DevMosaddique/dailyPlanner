const schedule = [
  { time: '14:00 - 16:00', task: 'Study Session-1' },
  { time: '16:00 - 16:15', task: 'Quick Break (Stretch/Hydrate)' },
  { time: '16:15 - 18:15', task: 'Study Session-2' },
  { time: '18:15 - 18:30', task: 'Study Break (Relax)' },
  { time: '18:30 - 20:00', task: 'Study Session-3' },
  { time: '20:00 - 22:00', task: 'Break (Dinner)' },
  { time: '22:00 - 00:00', task: 'Study Session-4' },
  { time: '00:00 - 00:15', task: 'Quick Break (Stretch/Hydrate)' },
  { time: '00:15 - 02:15', task: 'Study Session-5' },
  { time: '02:15 - 02:30', task: 'Study Break (Relax)' },
  { time: '02:30 - 04:30', task: 'Study Session-6' },
  { time: '04:30 - 04:45', task: 'Quick Break (Relax)' },
  { time: '04:45 - 06:45', task: 'Study Session-7' },
  { time: '06:45 - 07:00', task: 'Review/Recap Session' },
];

// Function to calculate current time since 1 PM (1 PM = 0 minutes)
function getCurrentTimeSince1PM() {
  const now = new Date();
  const hoursSince1PM = now.getHours() - 13; // Time since 1 PM in hours
  const minutes = now.getMinutes(); // Get minutes
  return hoursSince1PM * 60 + minutes; // Return time in minutes since 1 PM
}

// Function to display schedule
function displaySchedule() {
  const scheduleContainer = document.getElementById('schedule');
  const currentTime = getCurrentTimeSince1PM(); // Get current time in minutes since 1 PM
  let currentHighlighted = false; // Flag to ensure only one task is highlighted

  schedule.forEach((item, index) => {
    const scheduleItem = document.createElement('div');
    scheduleItem.classList.add('schedule-item');
    scheduleItem.innerHTML = `<strong>${item.time}</strong>: <span>${item.task}</span>`;

    // Parse start and end times
    const [startHour, startMinute] = item.time
      .split(' - ')[0]
      .split(':')
      .map(Number);
    const [endHour, endMinute] = item.time
      .split(' - ')[1]
      .split(':')
      .map(Number);

    // Convert start and end times to minutes since 1 PM
    const startTimeSince1PM = (startHour - 13) * 60 + startMinute; // Start time in minutes since 1 PM
    const endTimeSince1PM = (endHour - 13) * 60 + endMinute; // End time in minutes since 1 PM

    // Highlight current task (only one task)
    if (
      currentTime >= startTimeSince1PM &&
      currentTime <= endTimeSince1PM &&
      !currentHighlighted
    ) {
      scheduleItem.classList.add('highlight', 'current-task');
      currentHighlighted = true;
      notifyUser(item.task);
    }

    // Past tasks - Reduce brightness
    if (currentTime > endTimeSince1PM) {
      scheduleItem.classList.add('completed-task');
    }

    // Disable hover effect on current or past tasks
    if (currentTime >= startTimeSince1PM && currentTime <= endTimeSince1PM) {
      scheduleItem.classList.add('no-hover'); // Disable hover effect on current task
    } else if (currentTime > endTimeSince1PM) {
      scheduleItem.classList.add('no-hover'); // Disable hover effect on past tasks
    }

    // Add event listeners for marking tasks as completed
    scheduleItem.addEventListener('mousedown', () =>
      handleMouseDown(scheduleItem, index)
    );
    scheduleItem.addEventListener('mouseup', handleMouseUp);
    scheduleItem.addEventListener('mouseleave', handleMouseUp);

    scheduleContainer.appendChild(scheduleItem);
  });

  fetchMotivationalQuote();
  setInterval(fetchMotivationalQuote, 28800000); // Refresh every 8 hours
}

// Mark task as completed
function handleMouseDown(scheduleItem, index) {
  holdTimeout = setTimeout(() => {
    scheduleItem.classList.add('completed');
    markTaskAsCompleted(index);
  }, 5000); // Mark as completed after holding for 5 seconds
}

function handleMouseUp() {
  clearTimeout(holdTimeout); // Cancel task completion if mouse is released early
}

// Store completed task in local storage
function markTaskAsCompleted(index) {
  const completedTasks =
    JSON.parse(localStorage.getItem('completedTasks')) || {};
  completedTasks[index] = true;
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Notify user about the current task
function notifyUser(task) {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    new Notification('Current Task', { body: task });
  }
}

// Fetch motivational quote from the local JSON file
function fetchMotivationalQuote() {
  fetch('quotes.json') // Make sure the JSON file is hosted correctly
    .then((response) => response.json())
    .then((data) => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      const quoteContainer = document.getElementById('motivational-quote');
      quoteContainer.innerHTML = `
        <p class="quote">${randomQuote.quote}</p>
        <p class="author">- ${randomQuote.author}</p>`;
    })
    .catch(() => {
      document.getElementById('motivational-quote').innerHTML =
        '<p class="quote">"Your journey begins here. Keep pushing forward!"</p><p class="author">- Unknown</p>';
    });
}

// Countdown timer
function countdownTimer() {
  const countdownElement = document.getElementById('countdown');
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 40);

  const countdownInterval = setInterval(() => {
    const now = new Date();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = "Time's up!";
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      countdownElement.innerHTML = `${days} days remaining`;
    }
  }, 1000);
}

countdownTimer();
displaySchedule();
