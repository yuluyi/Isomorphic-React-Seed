import PhotoSwipe from 'photoswipe';
import domready from 'domready';
import domHtml from './dom.html';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

let galleryDOM = null;

domready(() => {
  galleryDOM = document.createElement('div');
  galleryDOM.innerHTML = domHtml;
  galleryDOM.setAttribute('id', 'gallery');
  galleryDOM.setAttribute('style', 'width: 0; height: 0; overflow: hidden;');
  document.body.appendChild(galleryDOM);
});

function getImgNaturalDimensions(img) {
    const nWidth = img.naturalWidth;
    const nHeight = img.naturalHeight;
    return [nWidth, nHeight];
}

export default function(els) {
  els = Array.prototype.slice.apply(els);
  // gallery.init();
  els.forEach((el, index) => {
    el.addEventListener('click', function(e) {
      // e.preventDefault();
      // e.stopPropagation();
      const gallery = new PhotoSwipe(
        galleryDOM.querySelectorAll('.pswp')[0],
        PhotoSwipeUI_Default,
        els.map(el => {
          const [w, h] = getImgNaturalDimensions(el);
          return {
            src: el.attributes.src.value,
            msrc: el.attributes.src.value,
            w,
            h,
            el
          }
        }),
        {
          tapToClose: true,
          shareEl: false,
          zoomEl: false,
          tapToToggleControls: false,
          clickToCloseNonZoomable: true,
          index,
          loop: false,
          getThumbBoundsFn: function(index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              const thumbnail = els[index]; // find thumbnail
              const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
              const rect = thumbnail.getBoundingClientRect();

              return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          }
        }
      );
      gallery.init();
    })
  })
}
