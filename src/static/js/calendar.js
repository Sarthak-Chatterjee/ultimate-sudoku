document.addEventListener('DOMContentLoaded', function () {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const monthYear = document.getElementById('monthYear');
    const daysContainer = document.querySelector('.days-container');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let today = new Date();

    // Function to display calendar for a given month and year
    function displayCalendar(month, year) {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        // Clear previous month's days
        daysContainer.innerHTML = '';

        // Display month and year
        monthYear.textContent = `${getMonthName(month)} ${year}`;

        // Display weekday abbreviations
        const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        weekdays.forEach(function (day) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('weekday', 'flex-row', 'center-items');
            daysContainer.appendChild(dayElement);
        });

        // Fill in days
        for (let i = 0; i < (startingDay+6)%7; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            daysContainer.appendChild(dayElement);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.classList.add('day', 'clickable');
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('current-day');
            }
            if (i % 2 === 0) {
                dayElement.innerHTML += '<span class="tick">&#10003;</span>'; // Tick sign for even dates
            } else {
                dayElement.innerHTML += '<span class="cross">&#10007;</span>'; // Cross sign for odd dates
            }
            daysContainer.appendChild(dayElement);
        }
    }

    // Function to get month name
    function getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }

    // Display initial calendar
    displayCalendar(currentMonth, currentYear);

    // Event listeners for previous and next month buttons
    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        nextMonthBtn.classList.remove('unclickable');
        displayCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', function () {
        if(!nextMonthBtn.classList.contains('unclickable')){
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            if(currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth >= today.getMonth())){
                nextMonthBtn.classList.add('unclickable');
                displayCalendar(today.getMonth(), today.getFullYear());
            }
            else{
                displayCalendar(currentMonth, currentYear);
            }
        }
    });
});
