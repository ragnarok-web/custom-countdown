const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById ('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElIinfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = "";
let countdownValue= Date; 
let countdownActive; // object to access globally
let savedCountdown;

const second = 1000 ;
const minute = second * 60;
const hour = minute * 60;
const day = hour *24;

// set the date input minimum with today's date
const today = new Date().toISOString().split('T')[0];  //new date gives you the date of today and toISOSstring to standerdies it
dateEl.setAttribute('min', today); // so that the calendar starts from today

// Populate Countdown / Complete UI
function updateDOM(){
   countdownActive = setInterval(() => { // repeat the function every 1 second
    const now = new Date().getTime();  // millisecond value from 1970 till now
    const distance = countdownValue - now;
    

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour );
    const minutes = Math.floor ((distance  % hour) / minute);
    const seconds = Math.floor ((distance  % minute) / second);
    

    // Hide input
    inputContainer.hidden = true;

    // If the countdown has ended, show complete
    if (distance < 0) {
        countdownEl.hidden = true;
        clearInterval(countdownActive);
        completeElIinfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        completeEl.hidden = false ;
    } else {
        // Else show the countdown in progress
        // Populating Countdown
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        completeEl.hidden = true;
        countdownEl.hidden = false;
    }
   }, second);
}

// Take values from Form input
function updatecountdown(e) {
    e.preventDefault();  // when you're submetting a form, that data will end up in a data base somewhere with the help of a netwrok request, but because it's not going anywhere it ends up refreshing the page instead. but we want to stop this and get that data.so this method cancels the event.
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown= {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown)); // save in local storage, and use json.stringify to convert back to a string cause the storage accepts only strings . But we need to retrieve the storage and turn it back to an object with json.parse. 
    // check for valid date
    if (countdownDate === '') {
        alert('please select a date for the countdown');
    }else{
        //  Get the number version of current date , update DOM
    countdownValue= new Date(countdownDate).getTime();
    updateDOM();
    
    }
}

// reset all values
function reset() {
    // Hide countdowns, show Input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // stop the countdown
    clearInterval(countdownActive);
    // reset the values
    countdownTitle = '';
    countdownDate  = '';
    localStorage.removeItem('countdown'); // delete the local storage to make a new date
}

function restorePreciousCountdown () {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown')); // it takes a json string and turns it back to an obejct
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue= new Date(countdownDate).getTime();
        updateDOM();
    }
}

// event Listeners
countdownForm.addEventListener('submit', updatecountdown);
countdownBtn.addEventListener('click',reset);
completeBtn.addEventListener('click', reset);

//  On load , check localStorage
restorePreciousCountdown();
