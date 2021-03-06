/**
 * make the nav (or any element) to be fixed on top
 * author: Bill.Zhao
 * repository: https://github.com/buildAll/fix-nav.js/blob/master/fix-nav.js
 * license: MIT
 */

(function($) {
    $.fn.fixNav = function(options) {

        var defaults = {
            autoRollTop: false,   // make the content below the fixed el roll to top when the el is clicked
            zIndex: 999,          // the z-index when the element is fixed
            maxWidth: false,      // the max-width of the fixed element
            fullWidth: false      // set the nav width to 100%. it can be used for flexbox
        };

        var settings = $.extend({}, defaults, options || {});

        var scrollDirection = {
            direction: '',
            preScrollTop: 0,
            curScrollTop: 0,
            getDirection: function() {
                this.curScrollTop = $(window).scrollTop();
                this.curScrollTop < this.preScrollTop ?
                    this.direction = 'up' :
                    this.direction = 'down';
                this.preScrollTop = this.curScrollTop;
            },
            isUp: function() {
                this.getDirection();
                return this.direction === 'up';
            },
            isDown: function() {
                this.getDirection();
                return this.direction === 'down';
            }
        };

        var utils = {
            rollTo: function(el, toWhere) {
                $(el).click(function() {
                    if ($(this).css('position') === 'fixed') {
                        $('body').animate({
                            scrollTop: toWhere
                        }, 100);
                    }
                });
            }
        }

        var styleCtrl = {
            isSet: false,
            preStyle: '',
            preTop: null,
            $el: null,
            setFix: function(el, originTop) {
                var that = this;
                if (!this.isSet) {
                    this.$el = $(el);

                    this.preStyle = this.$el.attr('style');
                    this.preTop = originTop;

                    this.$el.css({
                        position: 'fixed',
                        top: 0,
                        'z-index': settings.zIndex
                    });

                    this.isSet = true;

                    if (settings.fullWidth) {
                        this.$el.css('width', '100%');
                    }

                    if (settings.maxWidth) {
                        this.$el.css('maxWidth', settings.maxWidth + 'px');
                    }

                    if (settings.autoRollTop) {
                        utils.rollTo(this.$el.get(0), originTop);
                        this.$el.click(function() {
                            that.resetStyle();
                        });
                    }
                }
            },
            clearFix: function() {
                var windowTop;

                if (this.$el) {
                    windowTop = $(window).scrollTop();

                    if (windowTop <= this.preTop) {
                        this.resetStyle();
                    }
                }
            },
            resetStyle: function() {
                if (this.preStyle) {
                    this.$el.attr('style', this.preStyle);
                } else {
                    this.$el.removeAttr('style');
                }
                this.isSet = false;
            }
        };

        return this.each(function(index, el) {
            var originPoistion = $(el).offset().top;

            function scrollHandler() {
                var elementTop = originPoistion - $(window).scrollTop();

                if (scrollDirection.isDown() && elementTop <= -5) {
                    styleCtrl.setFix(el, originPoistion);
                } else {
                    styleCtrl.clearFix();
                }
            }

            $(window).scroll(function() {
                if (typeof window.requsetAnimationFrame === 'function') {
                    requsetAnimationFrame(scrollHandler);
                } else {
                    scrollHandler();
                }

            });
        });

    };
})(jQuery);
