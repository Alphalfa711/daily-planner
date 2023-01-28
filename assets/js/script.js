//* Wrap all code that interacts with the DOM in a call to jQuery to ensure that
//* the code isn't run until the browser has finished rendering all the elements
//* in the html.
$(function () {

  // Global variables
  var timeTitle = $('#currentTime');
  var dayTitle = $('#currentDay');
  //* Display the current date in the header of the page.
      timeTitle.text(dayjs().format('hh:mm:ssA'));
      dayTitle.text(dayjs().format('dddd, MMMM DD, YYYY'))
  var mainContainerHourDivList = $('#main-container').children();  
  var plannerDate = dayjs().format("YYYY-MM-DD");
  var plannerObj;
  var currentHour;
  var currentDay;

  function loadLocalStorage() {
    plannerObj = JSON.parse(localStorage.getItem('dailyPlanner'))
    if (!plannerObj) {
      plannerObj = {};
    }
  }



  
  //* Add a listener for click events on the save button. This code should
  //* use the id in the containing time-block as a key to save the user input in
  //* local storage. HINT: What does `this` reference in the click listener
  //* function? How can DOM traversal be used to get the "hour-x" id of the
  //* time-block containing the button that was clicked? How might the id be
  //* useful when saving the description in local storage?
  $('.saveBtn').on('click', function (event) {

    updateDate = plannerDate;
    console.log("🚀 ~ file: script.js:52 ~ updateDate", updateDate)
    updateHour = $(this).parent().attr('id');
    console.log("🚀 ~ file: script.js:53 ~ updateHour", updateHour)
    updateText = $(this).parent().children('textarea').first().val();
    console.log("🚀 ~ file: script.js:56 ~ updateText", updateText)
    
    if ( updateDate in plannerObj ) {
      plannerObj[updateDate][updateHour] = updateText;
    } else {
      plannerObj[updateDate] = {}
      plannerObj[updateDate][updateHour] = updateText;
    }
    
    alert("Successfully updated planner for " 
      + updateDate 
      + " @ " 
      + $(this).parent().children('div').first().text() )
    
      plannerObj[updateDate][updateHour] = updateText;
    localStorage.setItem('dailyPlanner', JSON.stringify(plannerObj));
  })


  //* Add code to apply the past, present, or future class to each time
  //* block by comparing the id to the current hour. HINTS: How can the id
  //* attribute of each time-block be used to conditionally add or remove the
  //* past, present, and future classes? How can Day.js be used to get the
  //* current hour in 24-hour time?

  function updatePlannerTheme () {

    //* Reset class for each div that is a first child of maincontainer
    mainContainerHourDivList.children('div').removeClass();
    mainContainerHourDivList.children('div').addClass("col-2 col-md-1 hour text-center py-3")

    //* Remove content of each textarea element that is a child of maincontainer
    mainContainerHourDivList.children('textarea').val('')
    
    mainContainerHourDivList.each(function () {  
      
      console.log($(this))

      currentHour = parseInt(dayjs().format('HH'));
      currentDay = parseInt(dayjs().format('DD'));
      
      // Reset text
      var thisHour = parseInt($(this).attr('data-hour'))
      
      // if (currentDay > parseInt(dayjs(plannerDate).format('DD'))) {
        
      //   $(this).addClass('past');

      // } else {
          
        if (thisHour === currentHour) {
          $(this).addClass('present')
        } else if ( thisHour > currentHour ) {
          $(this).addClass('future')
        } else {
          $(this).addClass('past')  
        }
      
      

        
      
      
      //! Re-formt this to take value from date picker
      
      // var plannerDate = '2023-01-25';
      
      var plannerHour = $(this).attr('id')
      
      if ( plannerDate in plannerObj ) {
        // console.log("line 84, this:", $(this))
        if ( plannerHour in plannerObj[plannerDate]) {
          // console.log("line 86, this:", $(this))
          // $(this).children('textarea').first().text(plannerObj[plannerDate][plannerHour])
          $(this).children('textarea').first().val(plannerObj[plannerDate][plannerHour])
        }
      }
      
      
      
      
      
    });
  }
    
  
  // TODO: Add code to get any user input that was saved in localStorage and set
  // TODO: the values of the corresponding textarea elements. HINT: How can the id
  // TODO: attribute of each time-block be used to do this?
  
  //? Define way to store in localStorage
  
  
  



  
  
  /**
   * Update time
   */
  function updateTime() {
    //* Update time every second
    timeTitle.text(dayjs().format('hh:mm:ssA'));    

    //* Update date only when clock shows midnight
    if (timeTitle == '12:00:00AM') {
      dayTitle.text(dayjs().format('dddd, MMMM DD, YYYY'))
      updatePlannerTheme();
    }
  }
  
  /**
   * jquery date picker element
   */
  $( "#datepicker" ).datepicker({
    dateFormat: "yy-mm-dd",
    // setDate: dayjs().format("YYYY-MM-DD"),
    showButtonPanel: true,        
    onSelect: function () {
      plannerDate = $(this).val();
      updatePlannerTheme();
    }
  });

  //Update time 
  loadLocalStorage();
  updatePlannerTheme();
  // Start updating time every second
  // var timer = setInterval(updateTime, 1000);
});
