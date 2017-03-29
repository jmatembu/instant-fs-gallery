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

      this.getCarouselEl().classList.remove('su_fs-carousel--active');
      this.removeElements('.su_fs-slides hr');

    },

    openCarousel: function () {

      this.loadSlideIndicators('hr');  

      this.getCarouselEl().classList.add('su_fs-carousel--active');

    },

    loadSlideIndicators: function () {

      var slideWrapper = this.getElement('.su_fs-slides'),
          num = this.getSlides().length,
          fragment = document.createDocumentFragment(),
          hr, val, bottom, top, i, position;

      if ( slideWrapper ) {

        for ( i = 0; i < num; i++ ) {

          position = {}; // reset object
          hr = document.createElement('hr');
          val = 8 - i - i + 'px';
          top = 'bottom: calc(100% - ' + val + ')';
          val = 47 - i - i;
          bottom = 'bottom: ' + val + 'px';
          position.top = top;
          position.bottom = bottom;

          this.slideIndicatorPositions[i] = position;
          hr.style.cssText = top;

          fragment.appendChild(hr);

        }

        slideWrapper.appendChild(fragment);

      }

      
      
    },

    positionSlideIndicators: function (index, num) {

      var hr, bottom, val, positions = [];

      for ( index = 0; index < num; index = index + 2 ) {

        hr = document.createElement(el);
        val = 6 - index + 2 + 'px';
        bottom = 'bottom: calc(100% - ' + val + ')';
        positions.push(bottom);

      }

      return positions;
    },

    positionActiveSlideIndicator: function () {

      var rulers = this.getElements('.su_fs-slides > hr'),
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
          prevBtn = this.getElement(this.elements.buttons.prevBtn),
          rulers = this.getElements('.su_fs-slides > hr');

      // if ( prevBtn.classList.contains('su_hidden') ) {
      //   prevBtn.classList.remove('su_hidden');
      // }

      if ( index + 1 < slides.length ) {
        slides[index].classList.remove('su_fs-slide--active');
        slides[index + 1].classList.add('su_fs-slide--active');
        rulers[index + 1].style.cssText = this.slideIndicatorPositions[index + 1].bottom;
      }
      
      
      //   if ( index + 1 === slides.length - 1 ) {
      //     this.getElement(this.elements.buttons.nextBtn).classList.add('su_hidden');
      //   }

        
      // }
    },

    prevSlide: function () {
      var slides = this.getSlides(),
          index = this.currentSlidePosition(),
          slideNum = slides.length,
          nextBtn = this.getElement(this.elements.buttons.nextBtn),
          rulers = this.getElements('.su_fs-slides > hr');


      // if ( nextBtn.classList.contains('su_hidden') ) {
      //   nextBtn.classList.remove('su_hidden');
      // }

      if ( index - 1 >= 0 ) {
        slides[index].classList.remove('su_fs-slide--active');
        slides[index - 1].classList.add('su_fs-slide--active');
        //console.log(rulers[index]);
        rulers[index - 1].style.cssText = this.slideIndicatorPositions[index - 1].top;
      }
      
      
      //   if ( index - 1 === 0 ) {
      //     this.getElement(this.elements.buttons.prevBtn).classList.add('su_hidden');
      //   }
      // }
    }

  },

  slides = fsCarousel.getElements(fsCarousel.elements.slide);

  slides && slides.forEach(function (element, index) {
    element.addEventListener('mouseover', function (e) {
      
      fsCarousel.openCarousel();
      
      this.classList.add('su_fs-slide--active');
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

  document.body.addEventListener('keyup', function (event) {

    if ( event.keyCode === 27 ) {

      var activeSlie = fsCarousel.getElement('.su_fs-slide--active');
      
      fsCarousel.closeCarousel();
      activeSlie && activeSlie.classList.remove('su_fs-slide--active');

    } else if ( event.keyCode === 39 ) {
      fsCarousel.nextSlide();
    } else if ( event.keyCode === 37 ) {
      fsCarousel.prevSlide();
    }
    
  }, false);

}());