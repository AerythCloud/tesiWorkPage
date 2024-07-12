const imageDisplay = document.getElementById('imageDisplay');
    const images = [      
      "https://i.postimg.cc/fyt13LN7/1-Eden.png",
      "https://i.postimg.cc/J0fvjLrf/2-Miele.png",
      "https://i.postimg.cc/FRn2sS2s/3-GEOX.png",
      "https://i.postimg.cc/xCdw25p4/4-REPLY.png",
      "https://i.postimg.cc/kgmXmrQY/5-Miele.png",
      "https://i.postimg.cc/h4XG814s/6-Frau.png",
      "https://i.postimg.cc/tCPCwRxV/7-Stellantis.png",
      "https://i.postimg.cc/KcC803R2/8-REPLY.png",
      "https://i.postimg.cc/Z5xYYfjb/9-Marelli.png",
      "https://i.postimg.cc/hG4DX939/10-Turisanda.png"
    ];

     const swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: '5',
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides: 10, // Ensure continuous scrolling by duplicating slides
        mousewheel: {
            releaseOnEdges: true,
        },
        on: {
            slideChangeTransitionEnd: function () {
                const activeIndex = this.realIndex;
                imageDisplay.style.opacity = 0;
                setTimeout(() => {
                    imageDisplay.src = images[activeIndex];
                    imageDisplay.style.opacity = 1;
                }, 500);
            },
            slideChange: function () {
                document.querySelectorAll('.swiper-slide').forEach(slide => {
                    slide.classList.remove('swiper-slide-active');
                });
                const activeSlide = document.querySelector('.swiper-slide.swiper-slide-active');
                if (activeSlide) {
                    activeSlide.classList.add('swiper-slide-active');
                }
            }
        }
    });

    // Handle click on slides
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            swiper.slideToLoop(parseInt(index), 500);
        });
    });

    // Allow whole page scroll
    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            swiper.slideNext();
        } else {
            swiper.slidePrev();
        }
    });

    // Initial trigger to set the active class
    document.querySelector('.swiper-slide-active').classList.add('swiper-slide-active');