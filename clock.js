define([ 'jquery' ], function( $ ) {

    function add( a, b ) {
        return a + b;
    }

    function toMilliseconds( value, unitInMilliseconds ) {
        return parseInt( value, /*BASE*/ 10 ) * unitInMilliseconds;
    }

    function pad( value ) {
        return value < 10 ? '0' + value : value;
    }

    function Clock( settings ) {
        this.time = settings.format || this.format( settings.time );
        this.direction = settings.mode || Clock.COUNT;
        this.increment = settings.increment || Clock.SECOND;
        this.render = settings.render || function() {};
        this.timer = 0;
    }

    Clock.BASE = 60;
    Clock.SECOND = 1000;
    Clock.MINUTE = Clock.SECOND * Clock.BASE;
    Clock.HOUR = Clock.MINUTE * Clock.BASE;
    Clock.COUNTDOWN = -1;
    Clock.COUNT = 1;

    Clock.prototype = {

        format: function( mixed ) {

            var MINUTES = 0, SECONDS = 1,
                time = mixed.split( ':' ),
                minutes = toMilliseconds( time[ MINUTES ], Clock.MINUTE ),
                seconds = toMilliseconds( time[ SECONDS ], Clock.SECOND );

            return minutes + seconds;
        },

        start: function() {

            var that = this;

            this.timer = setInterval(function() {
                that.update();
            }, Clock.SECOND );
        },

        stop: function() {
            clearInterval( this.timer );
            $(document).trigger('clock:stopped.clock');
        },

        getUnit: function( time, baseInMilliseconds ) {
            return {
                value: Math.floor( time / baseInMilliseconds ),
                mod: time % baseInMilliseconds
            };
        },

        getData: function() {

            var hours = this.getUnit( this.time, Clock.HOUR ),
                minutes = this.getUnit( hours.mod, Clock.MINUTE ),
                seconds = this.getUnit( minutes.mod, Clock.SECOND );

            return {
                hours: pad( hours.value ),
                minutes: pad( minutes.value ),
                seconds: pad( seconds.value ),
                time: this.time
            };
        },

        update: function() {
            if ( this.time > 0 ) {
                this.calculate();
                this.render( this.getData() );
            } else {
                this.stop();
            }
        },

        calculate: function() {
            this.time += this.increment * this.direction;
        }
    };

    return Clock;
});
