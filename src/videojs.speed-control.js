/*
 * speed-control
 * https://github.com/Versal/videojs-speed-control
 *
 * Copyright (c) 2014 Versal Team
 * Licensed under the MIT license.
 */

(function(vjs) {

    /**
     * Construct the speed control
     * @constructor
     * @param {Object} player reference to video player
     * @param {Object} options passed in from plugin initialization
     */


    /* deprecated
      vjs.SpeedControl = vjs.MenuItem.extend({
        init: function(player, options) {
          vjs.MenuItem.call(this, player, options);
        }
      });
    */
    var MenuItem = videojs.getComponent('MenuItem');
    vjs.SpeedControl = videojs.extend(MenuItem, {
        constructor: function(player, options) {
            MenuItem.call(this, player, options);
        }
    });

    function createSpeedControl() {
        var props = {
            className: 'vjs-speed-control vjs-control',
            innerHTML: buildSpeeds(),
            tabIndex: 0
        };

        /* deprecated
          return vjs.Component.prototype.createEl(null, props);
        */
        return vjs.getComponent("Component").prototype.createEl(null, props, {
            role: 'button',
            'aria-live': 'polite',
        });
    }

    /**
     * @returns {String} innerHTML string of <option> elements for select
     */
    function buildSpeeds() {
        // speeds are hard-coded for now - could pass in speeds instead
        // from plugin setup, if necessary
        var speeds = [0.5, 1, 2, 5, 10],
            resultHTML = '<select class="vjs-speed-select">';

        for (var i in speeds) {
            // make 1.0x the default speed
            if (speeds[i] === 1) {
                resultHTML += '<option value="' + speeds[i] + '"' +
                    'selected="selected">1x</option>';
            }
            else {
                resultHTML += '<option value="' + speeds[i] + '"' +
                    '>' + speeds[i] + 'x</option>';
            }
        }

        return resultHTML += '</select>';
    }

    /**
     * hook up events to the speed selector
     * @param {Object} select DOM obj of select element
     * @param {Object} player Reference to videojs player
     */
    function setSpeedEvents(select, player) {
        // setup an onChange listener on the speed select
        // and bind it to the player
        select.onchange = function(e) {
            var index = e.target.selectedIndex,
                newRate = e.target.options[index].value;

            /* deprecated
              // player.M === direct way to access <video>
              return this.M.playbackRate = newRate;
            */
            return player.playbackRate(newRate);
        }.bind(player);
    }

    /* deprecated
      function speedControl() {
        var options = { 'el': createSpeedControl() },
          speed = new vjs.SpeedControl(this, options),
          select;
  
        // append the speed select to the videojs control bar
        this.controlBar.el().appendChild(speed.el());
        select = document.getElementsByClassName('vjs-speed-select')[0];
  
        // pass in select and reference to player to events function
        return setSpeedEvents(select, this);
      }
      
      vjs.plugin('speedControl', speedControl);
    */

    var Plugin = vjs.getPlugin('plugin');
    var speedControl = vjs.extend(Plugin, {
        constructor: function(player, options) {
            Plugin.call(this, player, options);

            var options = { 'el': createSpeedControl() },
                speed = new vjs.SpeedControl(this, options),
                select;

            // append the speed select to the videojs control bar
            player.getChild("controlBar").el().appendChild(speed.el());
            select = document.getElementsByClassName('vjs-speed-select')[0];

            // pass in select and reference to player to events function
            return setSpeedEvents(select, player);
        }
    });

    //regist plugin
    vjs.registerPlugin('speedControl', speedControl);
}(window.videojs));
