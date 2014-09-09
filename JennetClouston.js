/**
 * defaults
 */
var defaults = ['Shaws', ' the laird'];
var curse = '"That is the house of {0}!" she cried. "Blood built it; blood stopped the building of it; blood shall bring it down. See here!" she cried again - "I spit upon the ground, and crack my thumb at it! Black be its fall! If ye see {1}, tell him what ye hear; tell him this makes the twelve hunner and nineteen time that Jennet Clouston has called down the curse on him and his house, byre and stable, man, guest, and master, wife, miss, or bairn - black, black be their fall!"';

/**
 * sprintf
 */
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        console.log(args);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

/*
 * The curse
 */
var requestCurse = function(e) {

    if (e.preventDefault) {
        e.preventDefault();
    }
    
    var wait = document.createElement('pre');
    wait.appendChild(document.createTextNode('Yer have to wait until Jenny is ready!'));
    document.getElementById('JennyCloustonsCurse').appendChild(wait);
    document.getElementById('submit').disabled = true;
    
    var victim = [];

    victim.push((this.house.value) ? this.house.value : defaults[0]);
    victim.push((this.name.value) ? this.name.value : defaults[1]);
    var query = String.format.apply(this, [curse].concat(victim));

    var audio = new Audio();
    audio.src = './tts.php?ie=utf-8&tl=en&q=' + query;
    
    audio.addEventListener('canplaythrough', function() {
        audio.play();
        document.getElementById('JennyCloustonsCurse').removeChild(wait); 
    });
    audio.addEventListener('ended', function() {
        document.getElementById('submit').disabled = false;
    });

    return;
};

/**
 * Init
 */
(function(window) {
    document.addEventListener('DOMContentLoaded', function(event) {
        document.getElementById('JennyCloustonsCurse').addEventListener('submit', requestCurse);
    });
})(window);
