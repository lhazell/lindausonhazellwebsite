
/*      CONTENTS:

 *  1. Helper functions
 *  2. Navigation Position Setter
 *  3. Scrolling Navigaion
 *  4. Radial Timer
 *  5. Slider Initialization
 *  6. Form Validation
 */

/**************************************
    1. Helper Functions
***************************************/

$(document).ready(function() {

    var getDeviceHeight = function() {
        if (typeof(window.innerHeight) == 'number') {
            //Non-IE
            return window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            //IE 6+ in 'standards compliant mode'
            return document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            //IE 4 compatible
            return document.body.clientHeight;
        }
        return 0;
    };

    //Checks device width and returns Bootstrap width class identifier
    var getBootstrapWidth = function() {
        var deviceWidth = getDeviceWidth();
        if (deviceWidth >= 1200) {
            return 'lg';
        } else if (deviceWidth >= 992 && deviceWidth < 1200) {
            return 'md';
        } else if (deviceWidth >= 768 && deviceWidth < 992) {
            return 'sm';
        } else if (deviceWidth < 768) {
            return 'xs';
        } else {
            return 'unknown';
        }
    };

    //Returns window with (Respond.js)
    var getDeviceWidth = function() {
        if (typeof(window.innerWidth) == 'number') {
            //Non-IE
            return window.innerWidth;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            //IE 6+ in 'standards compliant mode'
            return document.documentElement.clientWidth;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            //IE 4 compatible
            return document.body.clientWidth;
        }
        return 0;
    };

    var getSubDocument = function(embedding_element) {
        if (embedding_element.contentDocument)
            return embedding_element.contentDocument;
        else {
            var subdoc = null;
            try {
                subdoc = embedding_element.getSVGDocument();
            } catch(e) {}
            return subdoc;
        }
    };

    var getScrollPosition = function() {
        return $(window).scrollTop();
    };

/**************************************
    2. Navigation Position Setter
***************************************/

    var navPositionObject = (function() {
        var navHeight = parseInt($(".navbar").css("min-height"), 10),
            navTop = $(".hero").height();

        $(window).bind('scroll', function() {
            if (!(getBootstrapWidth() == 'xs') && ($(window).scrollTop() > navTop)) {
                $(".navbar").addClass("navbar-fixed-top");
            }
            else {
                $(".navbar").removeClass("navbar-fixed-top");
            }
        });
    }());

/**************************************
    3. Scrolling Navigaion
***************************************/

    var scrollingNavigation = (function() {
        var lastId,
            offset = 15,
            heroHeight = $(".hero").height();
            topMenu = $(".nav"),
            topMenuHeight = topMenu.outerHeight() + offset,
            menuItems = topMenu.find("a"),
            scrollItems = menuItems.map(function() {
                var item = $($(this).attr("href"));
                if (item.length) {
                    return item;
                }
            });
        
        // Bind click handler to menu items
        menuItems.click(function(e){
          var href = $(this).attr("href"),
              offsetTop = ($(href).offset().top-topMenuHeight+1) || 0;

          $('html, body').stop().animate({
              scrollTop: offsetTop
          }, 300);
          e.preventDefault();
        });

        // Bind to scroll
        $(window).scroll(function(){
          // Get container scroll position
          var fromTop = $(this).scrollTop() + topMenuHeight;
        
          // Get id of current scroll item
          var current = scrollItems.map(function() {
            var documentBottom = $(document).height(),
              atBottom = ($(this).scrollTop() + $(this).height()) == $(document).height();
               
            if ($(this).offset().top < fromTop) {
              return this;
            }
            //if element bottom == document bottom (i.e. too small, didn't trigger fromTop):
            else if ((($(window).height() + $(window).scrollTop()) >= $(document).height()) && (($(this).height() + $(this).offset().top) == $(document).height())) {
              return this;
            }

          });

          // Get the id of the current element
          current = current[current.length-1];
          var id = current && current.length ? current[0].id : "";
           
          if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
              .parent().removeClass("active")
              .end().filter("[href=#"+id+"]").parent().addClass("active");
          }
        });


    }());

/**************************************
    4. Radial Timer
***************************************/

    var timerObject = function(callback) {
        var self = this;
            this.timerCallback = callback;
            this.seconds = 0;
            this.timeToMiddle = 0;
            this.count = 0;
            this.degrees = 0;
            this.increment = 0;
            this.interval = null;
            this.timerHTML = "<div class='ghost'></div><div class='slice'><div class='q'></div><div class='pie r'></div><div class='pie l'></div></div>";
            this.timerContainer = null;
            this.slice = null;
            this.pie = null;
            this.pieRight = null;
            this.pieLeft = null;

        $(".pause").on("click", function(e) {
            e.preventDefault();
            $(this).toggleClass("paused");
            $(".pause-play").toggleClass("icon-pause icon-play");
        });

        this.start = function(s) {
            self.seconds = s;
            self.increment = 360 / self.seconds;
            self.interval = window.setInterval(function () {
                //check if pause button is clicked
                if (!($(".pause.paused").length)) {

                    if (self.count == Math.floor(self.seconds/2)) {
                        var timeToMiddle = ((self.seconds/2)-self.count) * 1000;
                        setTimeout(function(){
                            self.slice.addClass("c");
                            self.pieLeft.hide();
                        }, timeToMiddle);
                    }
                    self.degrees += self.increment;
                    self.pieRight.css({"transform":"rotate(" + self.degrees + "deg)"});

                    self.count++;

                    //Finished
                    if (self.count > (self.seconds)){
                        clearInterval(self.interval);
                        self.timerCallback();
                    }
                }
            }, 1000);
        };

        return {
            init: function(e, s) {
                self.timerContainer = $("#" + e);
                self.timerContainer.html(self.timerHTML);
                self.slice = self.timerContainer.find(".slice");
                self.pie = self.timerContainer.find(".pie");
                self.pieRight = self.timerContainer.find(".pie.r");
                self.pieLeft = self.timerContainer.find(".pie.l");
                self.start(s);
            },
            reset: function(t) {
                self.pie.show();
                self.slice.removeClass('c');
                self.timeToMiddle = 0;
                self.count = 0;
                self.degrees = 0;
                //move slices to original position without animation.
                self.pieRight.addClass('notransition');
                self.pieRight.css({"transform":"rotate(0deg)"});
                self.pieRight[0].offsetHeight; // Trigger a reflow
                self.pieRight.removeClass('notransition');

                self.start(t);
            }
        };
    };

    var initPauseButton = function () {
        var duration = 7,
            callbackFunction = function () {
                Timer.reset(duration);
                    
                //increment site description
                var $next = $(".site-description.active").removeClass("active").next(".site-description");
                    if ($next.length) {
                        $next.addClass("active");
                    } else {
                        $(".site-description:first").addClass("active");
                    }

                //change button link to active description
                var buttonUrl = $(".site-description.active").data("buttonUrl"),
                    buttonClass = $(".site-description.active").data("buttonClass"),
                    buttonText = $(".site-description.active").data("buttonText"),
                    devices = $(".devices-container .device"),
                    displayDevices = $(".site-description.active").data("displayDevices");


                if (displayDevices) {
                  //increment the slider
                  $("#code .slidesjs-next").trigger("click");

                  $(".devices-container .current").attr({"class": "current bottom"});
                  $("#code .btn").attr({
                      "href": buttonUrl,
                      "class": "btn btn-primary btn-lg " + buttonClass
                  }).html(buttonText);
                }
                else {
                  $("#code .btn").addClass("hidden");
                  $(".devices-container .current").attr({"class": "current top"});
                }
            };
        Timer = new timerObject(callbackFunction);
        Timer.init("timer", duration);
    }();

/**************************************
    5. Slider Initialization
***************************************/

    var sliderControl = (function (){

        //slidesjs initialization
        $(function() {
            $('#slides').slidesjs({
                width: 585,
                height: 366,
                start: 1,
                navigation: {
                    active: true,
                    effect: "slide"
                },
                pagination: {
                    active: false
                },
                play: {
                    auto: false,
                    active: false
                }
            });

            $('#slides2').slidesjs({
                width: 265,
                height: 353,
                start: 1,
                navigation: {
                    active: true,
                    effect: "slide"
                },
                pagination: {
                    active: false
                },
                play: {
                    auto: false,
                    active: false
                }
            });

            $('#slides3').slidesjs({
                width: 110,
                height: 198,
                start: 1,
                navigation: {
                    active: true,
                    effect: "slide"
                },
                pagination: {
                    active: false
                },
                play: {
                    auto: false,
                    active: false
                }
            });

            $('#slides4').slidesjs({
                width: 517,
                height: 746,
                start: 1,
                navigation: {
                    active: false
                },
                pagination: {
                    active: false
                },
                play: {
                    active: true,
                    effect: "slide",
                    interval: 5000,
                    auto: true,
                    pauseOnHover: true,
                }
            });
        });

    }());

/**************************************
    6. Form Validation
***************************************/

  $("#contact-form").bootstrapValidator({
      fields: {
          message: {
              validators: {
                  notEmpty: {
                      message: 'A message is required and cannot be empty'
                  }
              }
          },
          email: {
              validators: {
                  notEmpty: {
                      message: 'An e-mail address is required'
                  },
                  emailAddress: {
                      message: 'The input is not a valid email address'
                  }
              }
          },
      },
      submitHandler: function(validator, form, submitButton) {
          var fullName = validator.getFieldElements('name').val();
          $('.contact-modal')
              .find('.modal-title').html('Hello ' + fullName).end()
              .modal()
              .on('hidden.bs.modal', function () {
                  validator.defaultSubmit();
              });
      }
  });


}); //end