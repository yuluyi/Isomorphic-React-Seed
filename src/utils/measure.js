const numericPropertyRex = new RegExp(/^([-+]?\d*\.?\d+)(?:px)?$/, 'i');
const rnumnonpx = new RegExp( "^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$", "i" );
const getStyle = function (el, prop) {
    let value;
    if (getComputedStyle !== 'undefined') {
        value = getComputedStyle(el, null).getPropertyValue(prop);
    } else {
        value = el.currentStyle[prop] || 0;
        let leftCopy = el.style.left;
        let runtimeLeftCopy = el.runtimeStyle.left;

        el.runtimeStyle.left = el.currentStyle.left;
        el.style.left = (prop === 'fontSize') ? '1em' : value;
        value = el.style.pixelLeft + 'px';

        el.style.left = leftCopy;
        el.runtimeStyle.left = runtimeLeftCopy;
    }
    const regResult = numericPropertyRex.exec(value);
    return regResult ? parseFloat(regResult[1]) : value;
}

function isWindow( obj ) {
	return obj != null && obj === obj.window;
}

function getWindow( elem ) {
	return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
  const cssExpand = [ "top", "right", "bottom", "left" ];
  let i = extra === (isBorderBox ? 'border' : 'content') ? 4 : name === 'width' ? 1 : 0;
  let val = 0;
  for(; i < 4; i += 2) {
    if(extra === 'margin') {
      val += getStyle(elem, extra + '-' + cssExpand[i]);
    }

    if( isBorderBox ) {
      if(extra === 'content') {
        val -= getStyle(elem, 'padding-' + cssExpand[i]);
      }

      if(extra !== 'margin') {
        val -= getStyle(elem, 'border-' + cssExpand[i] + '-width');
      } else {
        val += getStyle(elem, 'padding-' + cssExpand[i]);

        if(extra !== 'padding') {
          val += getStyle(elem, 'border-' + cssExpand[i] + '-width');
        }
      }
    }
  }
  return val;
}

export default function measure(elem) {
  let dimension = {
    scrollTop() {
      return (elem === window || elem === document)
        ? (elem.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
        : elem.scrollTop;
    },
    scrollLeft() {
      return (elem === window || elem === document)
        ? (elem.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft)
        : elem.scrollLeft;
    },
    scrollHeight() {
      return (elem === window || elem === document)
        ? (document.body.scrollHeight)
        : elem.scrollHeight;
    },
    scrollWidth() {
      return (elem === window || elem === document)
        ? (document.body.scrollHeight)
        : elem.scrollHeight;
    },

    offset( options ) {

  		if ( !elem ) {
  			return;
  		}

  		// Support: IE <=11 only
  		// Running getBoundingClientRect on a
  		// disconnected node in IE throws an error
  		if ( !elem.getClientRects().length ) {
  			return { top: 0, left: 0 };
  		}

  		const rect = elem.getBoundingClientRect();

  		// Make sure element is not hidden (display: none)
  		if ( rect.width || rect.height ) {
  			const doc = elem.ownerDocument;
  			const win = getWindow( doc );
  			const docElem = doc.documentElement;

  			return {
  				top: rect.top + win.pageYOffset - docElem.clientTop,
  				left: rect.left + win.pageXOffset - docElem.clientLeft
  			};
  		}

  		// Return zeros for disconnected and hidden elements (gh-2310)
  		return rect;
  	}
  };

  Object.entries({
    Height: 'height',
    Width: 'width'
  }).forEach(([name, type]) => {
    Object.entries({
      padding: 'inner' + name,
      content: type,
      '': 'outer' + name
    }).forEach(([defaultExtra, funcName]) => {
      dimension[funcName] = function(margin, value) {
        if(elem === window) {
          return funcName.includes('outer') ? elem.document.documentElement['client' + name] : elem['inner' + name];
        }

        if(elem.nodeType === 9) {
          const doc = elem.documentElement;

          return Math.max(
            elem.body['scroll' + name], doc['scroll' + name],
            elem.body['offset' + name], doc['offset' + name],
            doc['client' + name]
          );
        }

        const extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');
        const isBorderBox = getStyle(elem, 'box-sizing') === 'border-box';
        let valueIsBorderBox = true;

        let val = 0;

        if(elem.getClientRects().length) {
          val = elem.getBoundingClientRect()[type];
        }

        if(document.msFullscreenElement && window.top !== winodw) {
          val *= 100;
        }

        if(val <= 0 || val == null) {
          val = getStyle(elem, type);

          if(val < 0 || val == null) {
            val = elem.style[type];
          }

          if(rnumnonpx.test(val)) {
            return val;
          }

          valueIsBorderBox = isBorderBox;

          val = parseFloat(val) || 0;
        }

        return (val + augmentWidthOrHeight(elem, type, extra || (isBorderBox ? 'border' : 'content'), valueIsBorderBox));
      }
    })
  });

  return dimension;
}
