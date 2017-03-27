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

    loadSlideIndicators: function (el) {

      var slideWrapper = this.getElement('.su_fs-slides'),
          num = this.getSlides().length * 2,
          hr, val, bottom, i;

      if ( slideWrapper ) {

        for ( i = 0; i < num; i = i + 2 ) {

          hr = document.createElement(el);
          val = 6 - i + 2 + 'px';
          bottom = 'bottom: calc(100% - ' + val;
          hr.style.cssText = bottom;

          slideWrapper.appendChild(hr);

        }
      }
      

    },


    currentSlide: function () {
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
          index = this.currentSlide(),
          prevBtn = this.getElement(this.elements.buttons.prevBtn);
          //hr = this.getElement(this.elements.slide + ' hr');

      if ( prevBtn.classList.contains('su_hidden') ) {
        prevBtn.classList.remove('su_hidden');
      }

      if ( index + 1 < slides.length ) {
        slides[index].classList.remove('su_fs-slide--active');
        slides[index + 1].classList.add('su_fs-slide--active');
        //slides[index + 1].querySelector('hr').style.cssText = 'bottom: 37px;';
        if ( index + 1 === slides.length - 1 ) {
          this.getElement(this.elements.buttons.nextBtn).classList.add('su_hidden');
        }
      }
    },

    prevSlide: function () {
      var slides = this.getSlides(),
          index = this.currentSlide(),
          slideNum = slides.length,
          nextBtn = this.getElement(this.elements.buttons.nextBtn);
          //hr = this.getElement(this.elements.slide + ' hr');

      if ( nextBtn.classList.contains('su_hidden') ) {
        nextBtn.classList.remove('su_hidden');
      }

      if ( index - 1 >= 0 ) {
        slides[index].classList.remove('su_fs-slide--active');
        slides[index - 1].classList.add('su_fs-slide--active');
        //slides[index - 1].querySelector('hr').style.cssText = 'bottom: 37px;';
        if ( index - 1 === 0 ) {
          this.getElement(this.elements.buttons.prevBtn).classList.add('su_hidden');
        }
      }
    }

  },

  slides = fsCarousel.getElements(fsCarousel.elements.slide);

  slides && slides.forEach(function (element, index) {
    element.addEventListener('mouseover', function (e) {
      
      fsCarousel.openCarousel();
      this.classList.add('su_fs-slide--active');

    }, false);
  });

  

  

  fsCarousel.getElement(fsCarousel.elements.buttons.nextBtn).addEventListener('click', function (event) {
    fsCarousel.nextSlide();
  });

  fsCarousel.getElement(fsCarousel.elements.buttons.prevBtn).addEventListener('click', function (event) {
    fsCarousel.prevSlide();
  });

  fsCarousel.getElement(fsCarousel.elements.buttons.closeBtn).addEventListener('click', function (event) {
    var activeSlie = fsCarousel.getElement('.su_fs-slide--active');
    fsCarousel.closeCarousel();

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