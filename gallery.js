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

    openCarousel: function () {

      this.loadSlideIndicators('span');  
      this.getCarouselEl().classList.add('su_fs-carousel--active');      

    },

    loadSlideIndicators: function () {

      var slideWrapper = this.getElement('.su_fs-slides'),
          num = this.getSlides().length,
          fragment = document.createDocumentFragment(),
          span, val, bottom, top, i, position;

      if ( slideWrapper ) {

        for ( i = 0; i < num; i++ ) {

          position = {}; // reset object
          span = document.createElement('span');
          val = 8 - i * 3 + 'px';
          top = 'bottom: calc(100% - ' + val + ')';
          val = 47 - i * 3;
          bottom = 'bottom: ' + val + 'px';
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
      } else {
        console.log('nothing');
      }
    },

    positionActiveSlideIndicator: function () {

      var rulers = this.getElements('.su_fs-slides > span'),
          index = this.currentSlidePosition();
      
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

      slides[index].classList.remove('su_fs-slide--active', 'su_mask-up', 'su_mask-down');
      rulers[index].style.cssText = this.slideIndicatorPositions[index].bottom;
      if (prevButton.classList.contains('su_hidden')) {
        prevButton.classList.remove('su_hidden');
      }
      if ( index + 1 <= slides.length - 1 ) {
        if (index + 1 === slides.length - 1) {
          nextButton.classList.add('su_hidden');
        }
        slides[index + 1].classList.add('su_mask-down');
        void slides[index + 1].offsetWidth;
        slides[index + 1].classList.add('su_fs-slide--active');
      }

    },

    prevSlide: function () {
      var slides = this.getSlides(),
          index = this.currentSlidePosition(),
          rulers = this.getElements('.su_fs-slides > span'),
          nextButton = this.getElement(this.elements.buttons.nextBtn),
          prevButton = this.getElement(this.elements.buttons.prevBtn);

      slides[index].classList.remove('su_fs-slide--active', 'su_mask-down', 'su_mask-up');
      rulers[index].style.cssText = this.slideIndicatorPositions[index].top;
      //slides[index].classList.remove('su_mask-down');

      if (nextButton.classList.contains('su_hidden')) {
        nextButton.classList.remove('su_hidden');
      }
      if ( index - 1 >= 0) {
        if (index - 1 === 0) {
          prevButton.classList.add('su_hidden');
        }
        slides[index - 1].classList.add('su_mask-up');
        void slides[index - 1].offsetWidth;
        slides[index - 1].classList.add('su_fs-slide--active');
        
      }
    }

  },

  slides = fsCarousel.getElements(fsCarousel.elements.slide);

  slides && slides.forEach(function (element, index) {
    element.addEventListener('mouseover', function (e) {
      var pos,
          slides = fsCarousel.getSlides(),
          nextButton = fsCarousel.getElement(fsCarousel.elements.buttons.nextBtn),
          prevButton = fsCarousel.getElement(fsCarousel.elements.buttons.prevBtn);

      fsCarousel.openCarousel();
      
      this.classList.add('su_fs-slide--active');
      
      pos = fsCarousel.currentSlidePosition();

      if (pos === 0) {
        prevButton.classList.add('su_hidden');
      } else if (pos === slides.length - 1) {
        nextButton.classList.add('su_hidden');
      }

      fsCarousel.positionActiveSlideIndicator();

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

}());