
var Jennet = (function( window, undefined) {
    'use strict';

    var parent;
    var logger;
    var progress = 0;
    var events = {
        curseEnd: new Event('_jennet:curseEnd')
    };

    var log = function(message, status){
        status = status || null;
        var node = document.createElement('div');
        if(status === 'error'){
            node.style.color = 'red';
            console.error(message);
        }
        node.innerHTML = message;
        logger.appendChild(node);
    };

    var defaults = function(){
        var nodes = parent.querySelectorAll('user-content');
        for(var i = 0; i < nodes.length; i++){
            nodes[i].setAttribute('default', nodes[i].textContent);
            nodes[i].setAttribute('index', i);
        }
    };

    var init = function(node){
        parent = node;
        logger = document.body.insertBefore(document.createElement('pre'), document.body.firstChild);
        Jennet.Speech.init();
        defaults();
    };

    var update = function(formElement){
        var nodes = parent.querySelectorAll('[key="' + formElement.id +'"]');
        for(var i = 0; i < nodes.length; i++){
            nodes[i].className = 'updated';
            if(nodes[i].getAttribute('key') === 'Sex'){
                var vals = formElement.value.split(',');
                nodes[i].textContent = (nodes[i].hasAttribute('object')) ? vals[0] : vals[1];
                continue;
            }
            nodes[i].textContent = formElement.value;
        }
    };
    var read = function(start){
            start = start || false;
            if(start){
                progress = 0;
            }
            if(progress >= (parent.childNodes.length - 1)){
                document.dispatchEvent(events.curseEnd);
                return;
            }
            var self = this;
            var sex = (parent.childNodes[progress].tagName.toLowerCase() === 'jenny') ? 'female' : 'male';
            var story = Jennet.Speech.speak(sex, parent.childNodes[progress].textContent);

            story.addEventListener('end', function() {
                read();
            });
            speechSynthesis.speak(story);
            progress++;
        };

    return {
        init: init,
        log: log,
        onCanSpeak: function(){},
        update: update,
        read: read
    };

})(window);

Jennet.Speech = (function( window, document, undefined) {
    'use strict';

    var _canSpeak = true;

    var canSpeakEvents = {
        success: new Event('_canSpeak:success'),
        failApi: new Event('_canSpeak:fail:Api'),
        failSystem: new Event('_canSpeak:fail:System')
    };

    var voices = {
        male: null,
        female: null
    };

    var onApiOk = function(){};

    var testSystem = function(){
        var whisper = new SpeechSynthesisUtterance();
        whisper.volume = 0;
        whisper.text = 'ok!';

        var my = this;
        whisper.onerror = function (message){
             document.dispatchEvent(canSpeakEvents.failSystem);
            _canSpeak = false;
        };

        whisper.onend = function(){
            if(_canSpeak){
                document.dispatchEvent(canSpeakEvents.success);
            }

        };
        speechSynthesis.speak(whisper);
    };

    var testAPI = function(){
        if(!('SpeechSynthesisUtterance' in window)){
            document.dispatchEvent(canSpeakEvents.failApi);
            _canSpeak = false;
        }
    };

    var selectVoices = function(){
        var filtered;
        var available = speechSynthesis.getVoices();

        filtered = available.filter(function(voice) {
            return (voice.lang === 'en-GB' && voice.name.toLowerCase().indexOf('male') > 0);
        });
        if(filtered.length){
            voices.male = filtered[0];
        }
        filtered = available.filter(function(voice) {
            return (voice.lang === 'en-GB' && voice.name.toLowerCase().indexOf('female') > 0);
        });
        if(filtered.length){
            voices.female = filtered[0];
        }
    };

    var getVoices = function(){
        // only partial support for `onvoiceschanged` event
        if('onvoiceschanged' in speechSynthesis) {
            speechSynthesis.onvoiceschanged = function(){
                selectVoices();
            };
        } else {
            selectVoices();
        }
    };

    var speak = function(voice, text){
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[voice];
        return utterance;
    };

    return {
        init: function(){
            testAPI();
            if(_canSpeak){
                getVoices();//async: run this while testing system
                testSystem();
            }
        },
        onApiOk: onApiOk,
        getVoices: getVoices,
        speak: speak
    };

})(window, document);
/**
 * Init
 */

(function(window) {
    'use strict';

    location.hash = '#home';
    document.addEventListener('DOMContentLoaded', function(event) {
        document.getElementById('Submit').disabled = true;
        document.getElementById('Submit').textContent = 'Testing...';

        document.addEventListener('_canSpeak:success', function(e){
            document.getElementById('Submit').disabled = false;
            document.getElementById('Submit').className = ('pure-button pure-button-primary');
            document.getElementById('Submit').textContent = 'Curse \'em!';
            ga('send', 'event', 'webSpeechApi', 'success');//anonymously reporting device support
        }, false);
        document.addEventListener('_canSpeak:fail:Api', function(e){
            document.getElementById('Submit').disabled = true;
            document.getElementById('Submit').textContent = 'Sorry, Web Speech not supported';
            Jennet.log('Darn! Your browser doesn\'t support the <a href="http://caniuse.com/#feat=speech-recognition">Web Speech API</a>.', 'error');
            ga('send', 'event', 'webSpeechApi', 'fail', 'noSupport');
        }, false);
        document.addEventListener('_canSpeak:fail:System', function(e){
            document.getElementById('Submit').disabled = true;
            document.getElementById('Submit').textContent = 'Sorry, Web Speech not supported';
            Jennet.log('Darn! Your system cannot render Webspeech Audio.', 'error');
            ga('send', 'event', 'webSpeechApi', 'fail', 'testSpeak');
        }, false);

        document.getElementById('Name').addEventListener('keyup', function(){Jennet.update(this);});
        document.getElementById('Sex').addEventListener('change', function(){Jennet.update(this);});
        document.getElementById('House').addEventListener('keyup', function(){Jennet.update(this);});

        Jennet.init(document.getElementById('JennyCloustonsCurse'));
        document.getElementById('Submit').addEventListener('click', function(e){
            e.preventDefault();
            if(e.target.disabled){
                return;
            }
            e.target.className = ('pure-button pure-button-primary cursing');
            e.target.disabled = true;
            Jennet.read(true);
        });
        document.addEventListener('_jennet:curseEnd', function(e){
            document.getElementById('Submit').className = ('pure-button pure-button-primary');
            document.getElementById('Submit').disabled = false;
        }, false);

       window.onhashchange = function(){
            switch(location.hash){
                case '#about':
                    document.getElementById('About').className = 'up';
                break;
                case '#home':
                    var nodes = document.querySelectorAll('.up');
                    for(var i = 0; i < nodes.length; i++){console.log(nodes[i]);
                        nodes[i].className = nodes[i].className.replace('up', '');
                    }
                break;
            }
        };


    });
})(window);
