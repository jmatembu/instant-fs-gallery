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
          prevButton = this.getElement(this.elements.buttons.prevBtn),
          carousel = this.getCarouselEl();

      nextButton.classList.remove('su_hidden');
      prevButton.classList.remove('su_hidden');
      carousel.classList.remove('su_fs-carousel--open');
      carousel.classList.add('su_fs-carousel--close');
      setTimeout(function() {
        fsCarousel.getCarouselEl().classList.remove('su_fs-carousel--close', 'su_fs-carousel--active');
      }, 300);

      
      this.removeElements('.su_fs-slides span');

    },

    loadSlideIndicators: function () {

      var slideWrapper = this.getElement('.su_fs-slides'),
          num = this.getSlides().length,
          slideHeight = document.querySelector('.su_fs-carousel.su_fs-carousel--active .su_fs-slide').offsetHeight,
          fragment = document.createDocumentFragment(),
          span, val, bottom, top, i, position;

      if ( slideWrapper ) {

        for ( i = 0; i < num; i++ ) {

          position = {}; // reset object
          span = document.createElement('span');
          span.setAttribute('class', 'su_fs-carousel-bars');
          val = i * 3;
          top = 'top: ' + val + 'px';
          val = (slideHeight - 39) + i * 3;
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

    positionActiveSlideIndicator: function (index) {

      var rulers = this.getElements('.su_fs-slides > span');
      
      if ( rulers ) {
        rulers[index].style.cssText = this.slideIndicatorPositions[index].bottom;
      }

    },

    nextSlide: function () {
      var slides = this.getSlides(),
          slideWrapper = this.getElement('.su_fs-slides'),
          rulers = this.getElements('.su_fs-slides > span'),
          //captions = this.getElements('.su_fs-slide figcaption'),
          nextButton = this.getElement(this.elements.buttons.nextBtn),
          prevButton = this.getElement(this.elements.buttons.prevBtn);


      if( curPos < slides.length && slides){

        var slideHeight = slides[curPos].offsetHeight;

        if ( slides[curPos] ) {
          slideWrapper.style.height = slideHeight + 'px;';
          slides[curPos].classList.remove('su_mask-up');
          slides[curPos].classList.add('su_mask-down');
          curPos++;
          rulers[curPos].style.cssText = 'transition: all .3s cubic-bezier(0.190, 1.000, 0.220, 1.000)';          
          rulers[curPos].style.cssText += this.slideIndicatorPositions[curPos].bottom;
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

      }
    },

    prevSlide: function () {
      var slides = this.getSlides(),
          rulers = this.getElements('.su_fs-slides > span'),
          nextButton = this.getElement(this.elements.buttons.nextBtn),
          prevButton = this.getElement(this.elements.buttons.prevBtn);

      if( curPos > 0 ){

        if ( rulers[curPos] ) {
          console.log('thisSlide: ' + curPos);
          curPos--;
          console.log('prevSlide: ' + curPos);
          slides[curPos].classList.remove('su_mask-down');
          slides[curPos].classList.add('su_mask-up');
          rulers[curPos].style.cssText = 'transition: all .3s cubic-bezier(0.190, 1.000, 0.220, 1.000)';          
          rulers[curPos].style.cssText += this.slideIndicatorPositions[curPos].top;

          if ( nextButton.classList.contains('su_hidden') ) {
            nextButton.classList.remove('su_hidden');
          }

          if ( curPos === 0 ) {
            prevButton.classList.add('su_hidden');
          }
        }
        
        
        
      }
    }

  },
  curPos = 0,

  slides = fsCarousel.getElements(fsCarousel.elements.slide);

  slides && slides.forEach(function (element, index) {
    element.addEventListener('click', function () {
      var pos = index,
          slides = fsCarousel.getSlides(),
          nextButton = fsCarousel.getElement(fsCarousel.elements.buttons.nextBtn),
          prevButton = fsCarousel.getElement(fsCarousel.elements.buttons.prevBtn);

      fsCarousel.getCarouselEl().classList.add('su_fs-carousel--active', 'su_fs-carousel--open'); 
      this.classList.add('su_fs-slide--active');
      fsCarousel.loadSlideIndicators('span');  

      fsCarousel.positionActiveSlideIndicator(index);
      curPos = index;
      if (index === slides.length - 1) {
        nextButton.classList.add('su_hidden');
      } else if (index === 0) {
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
    var activeSlide = fsCarousel.getElement('.su_fs-slide--active'),
        slideWrapper = fsCarousel.getElement('.su_fs-slides');

    if (slideWrapper) {
      slideWrapper.style.height = 'unset';
    }

    activeSlide && activeSlide.classList.remove('su_fs-slide--active');

    slides && slides.forEach(function (element, index) {
      element.classList.remove('su_mask-up', 'su_mask-down');
    });

  }, false);

  document.body.addEventListener('keyup', function (event) {

    if ( event.keyCode === 27 ) {

      var activeSlide = fsCarousel.getElement('.su_fs-slide--active');
      
      fsCarousel.closeCarousel();
      activeSlide && activeSlide.classList.remove('su_fs-slide--active');

    }

    if ( event.keyCode === 39 && curPos < slides.length - 1) {
      fsCarousel.nextSlide();
    } else if ( event.keyCode === 37 && curPos > 0) {
      fsCarousel.prevSlide();
    }
    
  }, false);


}());