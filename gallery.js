(function () {
	'use strict';

	var fsCarousel = {
    elements: {
      carouselEl: '.su_fs-carousel',
      slide: '.su_fs-slide',
      buttons: {
        closeBtn: '.su_icon--close',
        nextBtn: '.su_icon--next',
        prevBtn: '.su_icon--prev'
      }
    },
    slideIndicatorPositions: {},

    /**
     * Get the fullscreen carousel element
     * @return {DOM Node} a DOM node of the fs carousel.
     */
    getCarouselEl: function () {
      return document.querySelector(this.elements.carouselEl);
    },

    getSlides: function () {
      return this.getCarouselEl().querySelectorAll(this.elements.slide);
    },

    getElement: function (selector) {
      return this.getCarouselEl().querySelector(selector);      
    },

    getElements: function (selector) {
      return this.getCarouselEl().querySelectorAll(selector);
    },

    removeElements: function (selector) {

      var elements = this.getElements(selector);

      elements && elements.forEach(function (el, index) {
        el.remove();
      });

    },

    closeCarousel: function () {
      var nextButton = this.getElement(this.elements.buttons.nextBtn),
          prevButton = this.getElement(this.elements.buttons.prevBtn);

      nextButton.classList.remove('su_hidden');
      prevButton.classList.remove('su_hidden');
      this.getCarouselEl().classList.remove('su_fs-carousel--active');
      this.removeElements('.su_fs-slides span');

    },

    loadSlideIndicators: function () {

      var slideWrapper = this.getElement('.su_fs-slides'),
          num = this.getSlides().length,
          slideHeight = document.querySelector('.su_fs-carousel--active .su_fs-slide').offsetHeight,
          fragment = document.createDocumentFragment(),
          span, val, bottom, top, i, position;

      if ( slideWrapper ) {

        for ( i = 0; i < num; i++ ) {

          position = {}; // reset object
          span = document.createElement('span');
          val = 8 - i * 3 + 'px';
          top = 'bottom: calc(100% - ' + val + ')';
          val = (slideHeight - 8) + i * 3;
          console.log(val);
          bottom = 'top: ' + val + 'px';
          position.top = top;
          position.bottom = bottom;

          this.slideIndicatorPositions[i] = position;
          span.style.cssText = top;

          fragment.appendChild(span);

        }

        slideWrapper.appendChild(fragment);
      }
    },

    positionSlideIndicators: function () {

      var rulers = this.getElements('.su_fs-slides > span'),
          activeSlideIndex = this.currentSlidePosition();
      
      if ( rulers ) {
        
        for (var i = 0; i <= activeSlideIndex; i++) {
          rulers[i].style.cssText = this.slideIndicatorPositions[i].bottom;
        }
      
      }

    },

    toggleSlideIndicatorPosition: function (indicators, index) {
      var rulerPosition = indicators[index].style.cssText;

      if ( rulerPosition.includes(this.slideIndicatorPositions[index].bottom) ) {
        rulerPosition = this.slideIndicatorPositions[index].top;
      } else if ( rulerPosition.includes(this.slideIndicatorPositions[index].top) ) {
        rulerPosition = this.slideIndicatorPositions[index].bottom;
      }
    },

    positionActiveSlideIndicator: function (index) {

      var rulers = this.getElements('.su_fs-slides > span');
      
      if ( rulers ) {
        rulers[index].style.cssText = this.slideIndicatorPositions[index].bottom;
      }

    },

    currentSlidePosition: function () {
      var slides = this.getSlides(),
          currentIndex;
          
      slides && slides.forEach(function (element, index) {
        if ( element.classList.contains('su_fs-slide--active') ) {
          currentIndex = index;
        }
      });

      return currentIndex;
    },

    nextSlide: function () {
      var slides = this.getSlides(),
          index = this.currentSlidePosition(),
          rulers = this.getElements('.su_fs-slides > span'),
          nextButton = this.getElement(this.elements.buttons.nextBtn),
          prevButton = this.getElement(this.elements.buttons.prevBtn);

      if( curPos < slides.length ){
        console.log(curPos);
        slides[curPos].classList.remove('su_mask-up');
        slides[curPos].classList.add('su_mask-down');
        rulers[curPos].style.cssText = this.slideIndicatorPositions[curPos].bottom;
        curPos++;

        if ( prevButton.classList.contains('su_hidden') ) {
          prevButton.classList.remove('su_hidden');
        }
        if ( curPos === slides.length - 1 ) {
          nextButton.classList.add('su_hidden');

        }
        if ( curPos < slides.length ) {
          slides[curPos].classList.add('su_fs-slide--active');
        }
      }
    },

    prevSlide: function () {
      var slides = this.getSlides(),
          index = this.currentSlidePosition(),
          rulers = this.getElements('.su_fs-slides > span'),
          nextButton = this.getElement(this.elements.buttons.nextBtn),
          prevButton = this.getElement(this.elements.buttons.prevBtn);

      if(curPos > 0){
        curPos--;
        slides[curPos].classList.remove('su_mask-down');
        slides[curPos].classList.add('su_mask-up');
        rulers[curPos].style.cssText = this.slideIndicatorPositions[curPos].top;

        if (nextButton.classList.contains('su_hidden')) {
          nextButton.classList.remove('su_hidden');
        }
        if (curPos === 0) {
          prevButton.classList.add('su_hidden');
        }
        
      }
    }

  },
  curPos = 0,

  slides = fsCarousel.getElements(fsCarousel.elements.slide);

  slides && slides.forEach(function (element, index) {
    element.addEventListener('mouseover', function () {
      var pos = index,
          slides = fsCarousel.getSlides(),
          nextButton = fsCarousel.getElement(fsCarousel.elements.buttons.nextBtn),
          prevButton = fsCarousel.getElement(fsCarousel.elements.buttons.prevBtn);

      fsCarousel.getCarouselEl().classList.add('su_fs-carousel--active'); 
      this.classList.add('su_fs-slide--active');
      fsCarousel.loadSlideIndicators('span');  

      fsCarousel.positionActiveSlideIndicator(index);
      curPos = index;
      if (pos === slides.length - 1) {
        nextButton.classList.add('su_hidden');
      } else if (pos === 0) {
        prevButton.classList.add('su_hidden');
      }

    }, false);

  });

  fsCarousel.getElement(fsCarousel.elements.buttons.nextBtn).addEventListener('click', function (event) {
    fsCarousel.nextSlide();
  });

  fsCarousel.getElement(fsCarousel.elements.buttons.prevBtn).addEventListener('click', function (event) {
    fsCarousel.prevSlide();
  });

  fsCarousel.getElement(fsCarousel.elements.buttons.closeBtn).addEventListener('click', function (event) {
    
    fsCarousel.closeCarousel();
    var activeSlie = fsCarousel.getElement('.su_fs-slide--active');

    activeSlie && activeSlie.classList.remove('su_fs-slide--active');

    slides && slides.forEach(function (element, index) {
      element.classList.remove('su_mask-up', 'su_mask-down');
    });

  }, false);

  // document.body.addEventListener('keyup', function (event) {

  //   if ( event.keyCode === 27 ) {

  //     var activeSlie = fsCarousel.getElement('.su_fs-slide--active');
      
  //     fsCarousel.closeCarousel();
  //     activeSlie && activeSlie.classList.remove('su_fs-slide--active');

  //   } else if ( event.keyCode === 39 ) {
  //     fsCarousel.nextSlide();
  //   } else if ( event.keyCode === 37 ) {
  //     fsCarousel.prevSlide();
  //   }
    
  // }, false);

  function getElementHeight(selector) {
    return document.querySelector(selector).offsetHeight;
  } 

}());