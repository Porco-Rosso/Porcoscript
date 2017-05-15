// ==UserScript==
// @name         Porcoscript
// @namespace    https://github.com/Porco-Rosso/Porcoscript
// @downloadURL  https://github.com/Porco-Rosso/Porcoscript/blob/master/porcoscript.user.js
// @updateURL  https://github.com/Porco-Rosso/Porcoscript/blob/master/porcoscript.user.js
// @version      1.0
// @author       Porco-Rosso
// @match http://*.soundcloud.com/*
// @match https://*.soundcloud.com/*
// @match http://*.youtube.com/*
// @match https://*.youtube.com/*
// @description  This userscript is meant to provide integration to https://api.datmusic.xyz/ into other websites, such as soundcloud and youtube.
// @icon https://raw.githubusercontent.com/Porco-Rosso/Porcoscript/master/Logo_32x32.png
// @grant unsafeWindow
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
// Note, jQ replaces $ to avoid conflicts.
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

////////////////////// the guts of this userscript/////////////////////////////

/////////////////////// download function//////////////////////////////////////
function apifetch(query) {
  queryurl = 'https://porcoapi.omnipus.ga/search?q=' + query;

  if (window.location.href.indexOf("youtube") > -1) {
    jQ('.yt-Porcoscript-text').text('🐷 Searching...');
  } else {
    jQ('.sc-button:focus').text('🐷 Searching...');
  }

  jQ.getJSON(queryurl, function(JSONreply) {
    //data is the JSON string
    try {

      //JSONreply is the JSON string
      console.log(JSONreply.data[0].download);
      //APIresult = JSON.parse(data.body);
      //console.log(x.data[0]);
      //activate download
      jQ('<form></form>').attr('action', JSONreply.data[0].download).appendTo('body').submit().remove();

    } catch (err) {
      console.log("Caught!");
      if (window.location.href.indexOf("youtube") > -1) {
        jQ('.yt-Porcoscript-text').text('🐷 No Song Found');
      } else {
        jQ('.sc-button:focus').text('🐷 No Song Found');
      }
    } finally {
      // intentionally left blank
      if (window.location.href.indexOf("youtube") > -1) {
        jQ('.yt-Porcoscript-text:contains("Searching...")').text('🐷 Done');
      } else {
        jQ('.sc-button:focus:contains("Searching...")').text('🐷 Done');
      }
    }
  });
}
// Add apifetch function to window, so that onclick event can actually work.
unsafeWindow.apifetch = exportFunction(apifetch, unsafeWindow);


////////////////////// insert buttons /////////////////////////////////////////
function main() {
  // Note, jQ replaces $ to avoid conflicts.

  // see if we are on youtube
  if (window.location.href.indexOf("youtube") > -1) {

    ////////////////////// youtube code ///////////////////////////////////////////
    if (jQ('.yt-Porcoscript').length) {
      // do nothing if we have already loaded the button on song page
      setTimeout(main, 1000);
    } else {
      //get title
      var RawYtSearchTerm = jQ("#eow-title").text();
      RawYtSearchTerm = RawYtSearchTerm.replace(/['"]+/g, '');
      var YtSearchTerm = RawYtSearchTerm.trim().split(' ').join(' ');

      // Generate button
      var YTPorcoscriptButton = jQ('<div class="yt-uix-menu "><a onclick="apifetch(\'' + YtSearchTerm + '\')"><button class="yt-uix-button yt-Porcoscript Porcoscript-btn yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup click-cancels-autoplay yt-uix-menu-trigger yt-uix-tooltip" type="button" aria-haspopup="true" title="Search on Porcoscript" role="button" id="action-panel-overflow-button" aria-pressed="false" data-tooltip-text="Search on Porcoscript"><span class="yt-uix-button-content yt-Porcoscript-text">Porcoscript</span></button></a></div>');

      // Insert button
      var YtButtons = jQ("#watch8-secondary-actions");
      jQ(YtButtons).append(YTPorcoscriptButton);
      setTimeout(main, 1000);
    }

  } else {
    if (window.location.href.indexOf("soundcloud") > -1) {

      ////////////////////// soundcloud code ////////////////////////////////////////

      // check what type of page we are on, stream vs. song
      if (jQ('.fullHero__title').length) {

        if (jQ('.sc-Porcoscript').length) {
          // do nothing if we have already loaded the button on song page
          setTimeout(main, 1000);
        } else {
          // fetch title and artist on song page
          var RawSongTitle = jQ(".fullHero__title").find(".soundTitle__title").children().text();
          RawSongTitle = RawSongTitle.replace(/['"]+/g, '');
          var RawSongArtist = jQ(".fullHero__title").find(".soundTitle__username").text();
          RawSongArtist = RawSongArtist.replace(/['"]+/g, '');

          var SongTitle = RawSongTitle.trim().split(' ').join(' ');
          var SongArtist = RawSongArtist.trim().split(' ').join(' ');

          if (RawSongTitle.indexOf("-") >= 0) {
            var SearchTerm = SongTitle;
          } else {
            var SearchTerm = SongArtist + ' - ' + SongTitle;
          }

          // insert button on song page
          jQ('<button onclick="apifetch(\'' + SearchTerm + '\')" "class="sc-Porcoscript Porcoscript-btn sc-button-more sc-button sc-button-medium sc-button-responsive" tabindex="0" aria-haspopup="true" role="button" aria-owns="dropdown-button-821" title="Search on Porcoscript">Porcoscript</button>').insertAfter(jQ(".sc-button-toolbar").find(".sc-button-toolbar>.sc-button:last-child, .sc-button-group>.sc-button:last-child"));


          setTimeout(main, 1000);
        }

      } else {
        // if on stream page
        jQ(".soundList__item").each(function(i) {

          if (jQ(this).hasClass("has-Porcoscript") == true) {
            //do nothing if button is already loaded for the song list entry
          } else {

            jQ(this).addClass("has-Porcoscript");
            //fetch title and artist on stream
            var RawSongTitle = jQ(this).find(".soundTitle__title").children().text();
            RawSongTitle = RawSongTitle.replace(/['"]+/g, '');
            var RawSongArtist = jQ(this).find(".soundTitle__usernameText").text();
            RawSongArtist = RawSongArtist.replace(/['"]+/g, '');

            var SongTitle = RawSongTitle.trim().split(' ').join(' ');
            var SongArtist = RawSongArtist.trim().split(' ').join(' ');

            if (RawSongTitle.indexOf("-") >= 0) {
              var SearchTerm = SongTitle;
            } else {
              var SearchTerm = SongArtist + ' - ' + SongTitle;
            }
            // insert button for item
            jQ('<a onclick="apifetch(\'' + SearchTerm + '\')" class="sc-button-more sc-Porcoscript Porcoscript-btn sc-button sc-button-small sc-button-responsive" tabindex="0" title="Search on Porcoscript">Porcoscript</a>').insertAfter(jQ(this).find(".sc-button-toolbar>.sc-button:last-child, .sc-button-group>.sc-button:last-child"));
          }
        });
        // keep running the script to make sure we add buttons as content is dynamically loaded, probably not an efficient method :/
        setTimeout(main, 1000);
      }
    }
  }

}

// load jQuery and execute the main function
window.onload = addJQuery(main);
