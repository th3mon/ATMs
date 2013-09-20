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
/* jshint strict: false */
/* global Handlebars, List */
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

        app.cache = {};

        app.screens = {
            $start: $('#start'),
            $provinces: $('#provinces'),
            $province: $('#province'),
            $city: $('#city')
        };

        app.$screens = $('.screen');

        app.$buttons = $('.button');
        app.buttons = {
            $back: $('.button.back')
        };

        app.buttons.$back.on('click', app.onClickBackButton);
        app.screens.$provinces.find('a').on('click', app.showProvinceScreen);
        app.listjs.provinces();

        $('h1>a').on('click', app.showProvincesScreen);
        setTimeout(app.showProvincesScreen, 10);

        Handlebars.registerHelper('url', function(items, options) {
            var
                out = '',
                i = 0,
                item = {},
                buildUrl = function(item) {
                    var
                        bank = app.parseToPath(item.bank),
                        address = app.parseToPath(item.address),
                        id = app.parseToPath(item.id);

                    return '#' + bank + '_' + address + '_' + id;
                };

            for (; i < items.length; i++) {
                item = items[i];

                out += '<li><a href="' + buildUrl(item) + '">';
                out += ' <span class="address">Adres: ' + item.address + '</span>';
                out += ' <span class="bank">Bank: ' + item.bank + '</span>';
                out += '</a></li>';
            }

            return out;
        });
    },

    showScreen: function(screenName, callback){
        app.$screens.addClass('deactive');
        app.screens[screenName].removeClass('deactive');

        if ($.isFunction(callback)) {
            callback();
        }
    },

    showProvincesScreen: function(){
        app.showScreen('$provinces');
    },

    showProvinceScreen: function(province){
        var url = 'data/#province/#province.json';

        app.cache.backType = 'provinces';

        province = $(this).text() || province;
        app.cache.province = province;

        app.screens.$province.find('h2').text(province);
        province = app.parseToPath(province);
        url = url.replace(/#province/ig, province);

        app.cache.provinceUrl = province;

        $.getJSON(url, function(data) {
            var
                source = $('#province-template').html(),
                template = Handlebars.compile(source),
                html = template(data);

            app.screens.$province.find('ul').html(html);
            app.showScreen('$province', function() {
                app.screens.$province.find('a').on('click', function() {
                    app.showCities($(this).text());
                });

                app.listjs.province();
            });
        });
    },

    showCities: function(city){
        var
            url = 'data/#province/cities/#city.json',

            parseCityData = function(data){
                var
                    source = $('#cities-template').html(),
                    template = Handlebars.compile(source),
                    html = template(data);

                app.screens.$city.find('h2').text(data.city);
                app.screens.$city.find('article ul').html(html);
                app.showScreen('$city');

                $('#city li a').on('click', function() {
                    console.log($(this).attr('href'));
                });
            };

        app.cache.backType = 'province';
        app.cache.city = city;

        city = app.parseToPath(city);
        app.cache.cityUrl = city;

        console.log(city);
        url = url.replace('#city', city).replace('#province', app.cache.provinceUrl);

        $.getJSON(url, function(data){
            parseCityData(data);
        });
    },

    listjs: {
        provinces: function(){
            ( new List('listProvinces', {valueNames: ['province']}) );
        },
        province: function(){
            return ( new List('listCities', {valueNames: ['city']}) );
        }
    },

    parseToPath: function(str) {
        return str.toLowerCase()
            .replace(/\s|-/ig, '_')
            .replace(/"|'/ig, '')
            .replace(/ś/ig, 's')
            .replace(/ą/ig, 'a')
            .replace(/ę/ig, 'e')
            .replace(/ó/ig, 'o')
            .replace(/ł/ig, 'l')
            .replace(/ż|ź/ig, 'z')
            .replace(/ć/ig, 'c')
            .replace(/ń/ig, 'n');
    },

    onClickBackButton: function(){
        if ('province' === app.cache.backType) {
            app.showProvinceScreen(app.cache.province);
            app.cache.backType = '';
        }

        else if ('city' === app.cache.backType) {
            app.showProvinceScreen(app.cache.city);
            app.cache.backType = '';
        }

        else {
            app.showProvincesScreen();
        }
    }
};
