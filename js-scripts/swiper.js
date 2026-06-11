<script src="https://cdn.prod.website-files.com/67fce9ff038d5777166323d6/694ef4dac7362a817520efbc_swiper11-bundle-min-js.txt" defer></script>

<script>
  window.addEventListener('load', () => {
    
    const swiperOptions = {
      slidesPerView: 1,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      a11y: { enabled: true, slideRole: 'listitem' }
    };

    const swiper_shoreline = new Swiper('.swiper__shoreline', {
      ...swiperOptions,
      navigation: {
        nextEl: ".offers__swiper-btn--next.shoreline__swiper-btn",
        prevEl: ".offers__swiper-btn--prev.shoreline__swiper-btn",
      }
    });

    const swiper_bestAreas = new Swiper('.swiper__best-areas', {
      ...swiperOptions,
      navigation: {
        nextEl: ".offers__swiper-btn--next.best-areas__swiper-btn",
        prevEl: ".offers__swiper-btn--prev.best-areas__swiper-btn",
      }
    });

    const swiper_fastGrowingAreas = new Swiper('.swiper__fast-growing-areas', {
      ...swiperOptions,
      navigation: {
        nextEl: ".offers__swiper-btn--next.fast-growing-areas__swiper-btn",
        prevEl: ".offers__swiper-btn--prev.fast-growing-areas__swiper-btn",
      }
    });

    const swiper_familyAreas = new Swiper('.swiper__family-areas', {
      ...swiperOptions,
      navigation: {
        nextEl: ".offers__swiper-btn--next.family-areas__swiper-btn",
        prevEl: ".offers__swiper-btn--prev.family-areas__swiper-btn",
      }
    });

    const swiper_villaCommunities = new Swiper('.offers__swiper.swiper__villa-communities', {
      ...swiperOptions,
      navigation: {
        nextEl: ".offers__swiper-btn--next.villa-communities__swiper-btn",
        prevEl: ".offers__swiper-btn--prev.villa-communities__swiper-btn",
      }
    });

    const swiper6 = new Swiper('.swiper__business-center', {
      ...swiperOptions,
      navigation: {
        nextEl: ".offers__swiper-btn--next.business-center__swiper-btn",
        prevEl: ".offers__swiper-btn--prev.business-center__swiper-btn",
      }
    });
  });

  function convertUSDToAED(dollars, exchangeRate = 3.6725) {
    const dirhams = (dollars * exchangeRate).toFixed(3);
    const rounded = Math.round(dirhams / 1000);
    return Number(rounded).toLocaleString('ar-AE', { maximumFractionDigits: 0 });
  }
  
  function processCollectionPrices() {
    const aedPriceElements = document.querySelectorAll('.offers__district-type__currency-item--aed');
    aedPriceElements.forEach(element => {
      const usdPrice = parseFloat(element.getAttribute('data-price-in-usd'));
      if (!isNaN(usdPrice)) {
        const aedPrice = convertUSDToAED(usdPrice);
        element.textContent = `${aedPrice}K AED`;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', processCollectionPrices);
</script>
