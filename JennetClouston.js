
var Jennet = (function( window, undefined) {
    'use strict';

    var defaults = ['Shaws', 'the laird', 'him', 'his'];
    var classes = ['house', 'name', 'sex', 'sex1'];
    var parent;
    var logger;
    var progress = 0;

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
            if(progress > parent.childNodes.length){
                return;
            }
            var self = this;
            if(start){
                progress = 0;
            }

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

    var _canSpeak = true;
    var canSpeakEvent = new Event('_canSpeak');

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
            Jennet.log('Darn! Your system cannot render Webspeech Audio.', 'error');
            _canSpeak = false;
        };

        whisper.onend = function(){
            if(_canSpeak){
                document.dispatchEvent(canSpeakEvent);
            }

        };
        speechSynthesis.speak(whisper);
    };

    var testAPI = function(){
        if(!('SpeechSynthesisUtterance' in window)){
            Jennet.log('Darn! Your browser doesn\'t support the <a href="http://caniuse.com/#feat=speech-recognition">Wep Speech API</a>.', 'error');
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
    }

    var getVoices = function(){
        // only partial support for `onvoiceschanged` event
        if('onvoiceschanged' in speechSynthesis) {
            speechSynthesis.onvoiceschanged = function(){
                selectVoices();
            }
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
    document.addEventListener('DOMContentLoaded', function(event) {
        document.getElementById('Submit').disabled = true;
        document.getElementById('Submit').textContent = 'Testing...';

        Jennet.init(document.getElementById('JennyCloustonsCurse'));
        document.addEventListener('_canSpeak', function(e){
            document.getElementById('Submit').disabled = false;
            document.getElementById('Submit').textContent = 'Curse \'em!';
        }, false);

        document.getElementById('Name').addEventListener('keyup', function(){Jennet.update(this)});
        document.getElementById('Sex').addEventListener('change', function(){Jennet.update(this)});
        document.getElementById('House').addEventListener('keyup', function(){Jennet.update(this)});

        document.getElementById('Submit').addEventListener('click', function(e){
            e.preventDefault();
            Jennet.read(true);

        }, false);

    });
})(window);
