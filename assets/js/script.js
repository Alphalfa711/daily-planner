$(function () {

  //* Global variables
  var timeTitle = $('#currentTime');
  var dayTitle = $('#currentDay');
  //* Display the current date in the header of the page.
      timeTitle.text(dayjs().format('hh:mm:ssA'));
      dayTitle.text(dayjs().format('dddd, MMMM DD, YYYY'))
  var mainContainerHourDivList = $('#main-container').children();  
  var plannerDate = dayjs().format("YYYY-MM-DD");
  var todaysDate;
  var daysDiff;
  var plannerObj;
  var currentHour;


  /**
   * Initiate function after all content of the file has been loaded
   */
  function init() {
    // Start updating time every second
    var timer = setInterval(updateTime, 1000);
    //* Update time 
    loadLocalStorage();
    //* Update planner elements using today's date
    updatePlanner();    
  }


  /**
   * Load content of localStorage into plannerObj
   * If localStorage is emplty set it to an empty object 
   */ 
  function loadLocalStorage() {
    plannerObj = JSON.parse(localStorage.getItem('dailyPlanner'))
    if (!plannerObj) {
      plannerObj = {};
    }
  }


  /** 
   * Listen for clicks on any button with clas .saveBtn
   * on click update DOM element and localStorage
   * Notify user once completed
   */
  $('.saveBtn').on('click', function () {
    
    //* Get selected date from datepicker
    updateDate = plannerDate;
    //* Find out hour id of the clicked button's parent
    updateHour = $(this).parent().attr('id');
    //* Find out value of textare of buttons sibling
    updateText = $(this).parent().children('textarea').first().val();
    
    //* Check to make sure date key excist in localStorage for date selected from datepicker
    //* If date excist, update key value represented by hour inside it's object
    if ( updateDate in plannerObj ) {
      plannerObj[updateDate][updateHour] = updateText;
    } else {
      //* Create key first, then update key value represented by hour inside it's object
      plannerObj[updateDate] = {}
      plannerObj[updateDate][updateHour] = updateText;
    }
    
    //* Notify user about the update
    alert("Successfully updated planner for " 
      + updateDate 
      + " @ " 
      + $(this).parent().children('div').first().text() )
    
      //* Update plannerObj and localStorage
    plannerObj[updateDate][updateHour] = updateText;
    localStorage.setItem('dailyPlanner', JSON.stringify(plannerObj));
  })


  /**
   * Reset palanner color formatting and text
   */
  function resetPlanner() {
    //* Reset class for each div that is a first child of maincontainer
    mainContainerHourDivList.removeClass();
    mainContainerHourDivList.addClass("row time-block")

    //* Remove content of each textarea element that is a child of maincontainer
    mainContainerHourDivList.children('textarea').val('')
  }
  

  /**
   * Update color and content for each hour in the planners
   */
  function updatePlanner () {

    //* Reset planner color formatting and text
    resetPlanner();
        
    //* Get current time and date
    currentHour = parseInt(dayjs().format('HH'));
    todaysDate = dayjs().format('YYYY-MM-DD');

    //* Calculate difference in days between today's date and date selected by user on datepicker
    daysDiff = dayjs(plannerDate).diff(dayjs(todaysDate), 'day')

    //* Loop throught each div that is a first child of main-container
    mainContainerHourDivList.each(function () {  

      //* Update planner class / color
      //* If planner date is set to today check for hour before asigning additional class
      if ( daysDiff === 0 ) {
        var thisHour = parseInt($(this).attr('data-hour'))
        if (thisHour === currentHour) {
          $(this).addClass('present')
        } else if ( thisHour > currentHour ) {
          $(this).addClass('future')
        } else {
          $(this).addClass('past')  
          console.log(this)
        }
      //* Format planner's day as past if user selected date that is behind today's date
      } else if ( daysDiff < 0 ) {
        $(this).addClass('past');  
      //* Format planner's day as future if user selected date that is ahead of today's date
      } else {        
        $(this).addClass('future')
      }
      

      //* Update planner content      
      var plannerHour = $(this).attr('id')
      //* If planner date key excist in localStorage check to see if key for hour set to div id currently in loop excist and if so display it's value
      if ( plannerDate in plannerObj ) {
        if ( plannerHour in plannerObj[plannerDate]) {
          $(this).children('textarea').first().val(plannerObj[plannerDate][plannerHour])
        }
      }
    });
  }


  /**
   * Update time
   */
  function updateTime() {
    //* Update time every second
    timeTitle.text(dayjs().format('hh:mm:ssA'));    
    // console.log("🚀 ~ file: script.js:149 ~ updateTime ~ timeTitle", timeTitle.text())
    // console.log("🚀 ~ file: script.js:149 ~ updateTime ~ timeTitle",typeof timeTitle.text())
    

    //* Update date only when clock shows midnight
    if (timeTitle.text() == '12:00:00AM') {
      dayTitle.text(dayjs().format('dddd, MMMM DD, YYYY'))
      //* Reload page at midnight
      location.reload();
    }
  }
  
  /**
   * jquery date picker element
   */
  $( "#datepicker" ).datepicker({
    dateFormat: "yy-mm-dd",
    showButtonPanel: true,        
    onSelect: function () {
      plannerDate = $(this).val();
      updatePlanner();
    }
  });
  
  //* Start updating page
  init();
});
