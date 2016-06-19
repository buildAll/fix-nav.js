(function($) {
    jQuery.fn.fixNav = function( options ) {

        var defaults = {
        };

        var settings = $.extend( {}, defaults, options );

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

        var styleCtrl = {
            isSet: false,
            preStyle: '',
            preTop: null,
            $el: null,
            setFix: function(el, originTop) {
                if (!this.isSet) {
                    this.$el = $(el);

                    this.preStyle = this.$el.attr('style');
                    this.preTop = originTop;

                    this.$el.css({
                        'position': 'fixed',
                        'top': 0,
                    });

                    this.isSet = true;
                }
            },
            clearFix: function() {
                var windowTop;

                if (this.$el) {
                    windowTop = $(window).scrollTop();

                    if (windowTop <= this.preTop) {
                        if (this.preStyle) {
                            this.$el.attr('style', this.preStyle);
                        } else {
                            this.$el.removeAttr('style');
                        }
                        this.isSet = false;
                    }
                }
            }
        };

        return this.each(function(index, el) {
            var viewportOffset = el.getBoundingClientRect();
            var originPoistion = viewportOffset.top;

            $(window).scroll(function() {
                var viewportOffset = el.getBoundingClientRect();
                var elementTop = viewportOffset.top;

                if (scrollDirection.isDown() && elementTop <= 0 ) {
                    styleCtrl.setFix(el, originPoistion);
                } else {
                    styleCtrl.clearFix();
                }
            });
        });

    };
})($);
