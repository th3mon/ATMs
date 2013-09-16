/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('load', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var
            parentElement = document.getElementById(id),
            listeningElement = parentElement.querySelector('.listening'),
            receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        app.$startScreen = $('#start');
        app.$homeScreen = $('#home');
        app.$buttons = $('.button');
        app.$buttons.on('click', app.onClickCityButton);
        app.$atmsScreen = $('#atms');
        $('h1>a').on('click', app.showHomeScreen);
        setTimeout(app.showHomeScreen, 10);
    },

    showHomeScreen: function(){
        var $screens = app.$startScreen;

        $screens.add(app.$atmsScreen).addClass('deactive');
        app.$homeScreen.removeClass('deactive');
    },

    showAtmsScreen: function(){
        var $screens = app.$startScreen;

        $screens.add(app.$homeScreen).addClass('deactive');
        app.$atmsScreen.removeClass('deactive');
    },

    loadATMs: function(city){
        var
            url = 'data/banks/#city.json',
            parseCity = function(city) {
                return city.toLowerCase()
                    .replace(' ', '_')
                    .replace(/ś/ig, 's')
                    .replace(/ą/ig, 'a')
                    .replace(/ę/ig, 'e')
                    .replace(/ó/ig, 'o')
                    .replace(/ł/ig, 'l')
                    .replace(/ż|ź/ig, 'z')
                    .replace(/ć/ig, 'c')
                    .replace(/ń/ig, 'n');
            };

        city = parseCity(city);
        url = url.replace('#city', city);

        $.getJSON(url, function(data){
            app.ATMs = data;
            app.onDataLoaded();
        });
    },

    onClickCityButton: function(){
        var city = $(this).data('city');

        app.loadATMs(city);
    },

    onDataLoaded: function(){
        app.parseData();
    },

    parseData: function(){
        var
            source = $("#atms-template").html(),
            template = Handlebars.compile(source),
            html = template(app.ATMs);

        app.$atmsScreen.find('h2').text(app.ATMs.city);
        app.$atmsScreen.find('article ul').html(html);
        app.showAtmsScreen();
    }
};
