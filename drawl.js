/**
 * Drawl.js
 *
 * Javascript that simulates a "draw" effect on the stroke of an SVG, fades out
 * the stroke, and fades in a fill color.
 *
 * @version v0.2.0
 * @link https://github.com/brennan-v/drawl
 * @license 2014 - 2015 MIT
 *
 * Started by Nick Salloum (Draw-Fill-SVG);
 * (Drawl.js) by Brennan Vargas.
 */

(function (window) {

    'use strict';

    /**
     * Detect the transition prefix that browser uses (technique used by Modernizr but slightly better).
     */

    function getTransitionPrefix(){
        var i,
            undefined,
            el = document.createElement('div'),
            transitions = {
                'transition':'transitionend',
                'OTransition':'otransitionend',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };

        for (i in transitions) {
            if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
                return transitions[i];
            }
        }
     }
    //use the variable to store the browser's supported prefix.
    var prefixedTransition = getTransitionPrefix();

    /**
     * Pure JavaScript equivalent of Jquery's extend method.
     */

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * Drawl Constructor
     */

    function Drawl(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * Drawl Default Options
     *
     * Option Descriptions:
     * drawlClass - HTML Class that will be animated.
     * replaySelector - HTML Class you can assign to an element to replay animation.
     * initialDelay - Delay before animation starts, time in milliseconds (1000 ms = 1 second).
     */

    Drawl.prototype.options = {
        drawlClass: "drawl",
        replayClass: null,
        initialDelay: 0
    }

    /**
     * Drawl _init
     *
     * Initialise Drawl
     */

    Drawl.prototype._init = function () {

        // find all SVG elements with the set drawlClass & its inner path tag.
        this.paths = document.querySelectorAll("." + this.options.drawlClass + " path");

        // hides the SVG elements initially.
        for (var i = 0; i < this.paths.length; i++) {
            var path = this.paths[i];

            path.style.fillOpacity = 0;
            path.style.strokeOpacity = 0;

            path.style.transition = path.style.prefixedTransition = "none";
        }

        // checks to see if the browser is internet explorer, this check is needed for future work.
        this.isIE  = (navigator.userAgent.indexOf('MSIE ') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1 || navigator.userAgent.indexOf('Edge/') !== -1);

        // if the replay option class is set within a new drawl, search the document for all elements with the class. When they are found, you can click to replay animation.
        if (this.options.replayClass != null){
            var self = this; //stupid thing
            this.replayObj = document.querySelectorAll('.' + this.options.replayClass)
            //alert(this.replayObj.length + ' replayClasses found!');
                if(this.replayObj.length > 0){
                    for (var i = 0; i < this.replayObj.length; i++) {
                       this.replayObj[i].addEventListener("click",  function(){self._initAnimation()}, false);
                    }
                }else{
                    console.log('Drawl could not find any elements with your replay class.');
                }
        }
        //check for initialDelay option
            if (this.options.initialDelay > 0) {
            var self = this; //stupid thing
            window.setTimeout(function(){self._initAnimation()}, this.options.initialDelay);
        }
        else {
            this._initAnimation();
        }
    }

    /**
     * Drawl _initAnimation()
     *
     * Reset some style properties on our paths, add some transitions, set the
     * stroke-dasharray to the length of the path, and the stroke-dashoffset to
     * the length of the path pushing it out of view initially. Then, set the
     * stroke-dashoffset to 0, animating the strokes in a drawing manner. Then,
     * run the path filler sequence.
     */

    Drawl.prototype._initAnimation = function () {
        for (var i = 0; i < this.paths.length; i++) {
            var path = this.paths[i];
            var length = path.getTotalLength();
            //alert(length.length);
            // reset opacities
            path.style.fillOpacity = 0;
            path.style.strokeOpacity = 1;

            // reset transitions
            path.style.transition = path.style.prefixedTransition = "none";

            // reset stroke dash array and stroke dash offset
            path.style.strokeDasharray = length + " " + length;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect();

            // apply new transitions
            path.style.transition = path.style.prefixedTransition = "stroke-dashoffset 2s ease-in-out";

            //TODO review possible IE workaround by rendering each frame.
            // since IE does not support CSS transitions, transforms, and animations on SVG elements - for now just display the SVG
            if(this.isIE){
                path.style.fillOpacity = 1;
                path.style.strokeOpacity = 1;
            }
            //if not IE, lets get ready to rumble
            else{

            path.style.strokeDashoffset = 0;

            // fill the path
            this._fillPath(path);
            }
        }
    }

    /**
     * Drawl _fillPath()
     *
     * Resets the transition props, then fills the path and fades out the stroke
     * by updating the styles.
     */

    Drawl.prototype._fillPath = function (path) {
        path.addEventListener(prefixedTransition,  function () {
            // reset transitions
            path.style.transition = path.style.prefixedTransition = "none";
            path.style.transition = path.style.prefixedTransition = "fill-opacity 1s ease-in-out, stroke-opacity 1s ease-in-out";

            // edit props
            path.style.fillOpacity = 1;
            path.style.strokeOpacity = 0;
        });
    }

    /**
     * Add to global namespace
     */

    window.Drawl = Drawl;

})(window);