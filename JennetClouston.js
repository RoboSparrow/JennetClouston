'use strict';

/**
 * defaults
 */
var defaults = ['Shaws', ' the laird', 'him', 'his'];
var classes = ['house', ' name', 'sex', 'sex1'];

var curse = '"That is the house of {0}!" she cried. "Blood built it; blood stopped the building of it; blood shall bring it down. See here!" she cried again - "I spit upon the ground, and crack my thumb at it! Black be its fall! If ye see {1}, tell {2} what ye hear; tell {2} this makes the twelve hunner and nineteen time that Jennet Clouston has called down the curse on {2} and {3} house, byre and stable, man, guest, and master, wife, miss, or bairn - black, black be their fall!"';

/**
 * sprintf
 */
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

/*
 * The curse
 */
var JennetCloustonCurse  = function(){
	
	this.request = function(form){
		var node = document.getElementById('JennyCloustonsCurse');
		
        var wait = document.createElement('pre');
		wait.appendChild(document.createTextNode('Yer have to wait until Jenny is ready!'));
        node.parentNode.insertBefore(wait, node.nextSibling);
        
		document.getElementById('submit').disabled = true;
		
		var victim = this.victim(form);
		//var query = String.format.apply(this, [curse].concat(victim));
        var query = strip(node);

		var audio = new Audio();
		audio.src = './tts.php?ie=utf-8&tl=en&q=' + query;
		audio.addEventListener('canplaythrough', function() {
			audio.play();
			node.parentNode.removeChild(wait); 
		});
		audio.addEventListener('ended', function() {
			document.getElementById('submit').disabled = false;
		});
	};
	
	function strip(node){
		return node.textContent || node.innerText || "";
	};
	
	this.inject = function(values, tag){
        var inject = [];
        for(var i = 0; i < values.length; i++){
            var wrap = ['', ''];
            if(typeof tag !== 'undefined'){
                wrap[0] = '<' + tag + ' class="' + classes[i] +'">';
                wrap[1] = '</' + tag + '>';
            }
			inject.push(wrap[0] + values[i] + wrap[1]);
		}
        return String.format.apply(this, [curse].concat(inject));
	};
	
	this.victim = function(form){
		var victim = [];
		victim.push((form.house.value) ? form.house.value : defaults[0]);
		victim.push((form.name.value) ? form.name.value : defaults[1]);
		victim.push((form.sex.value) ? form.sex.value : defaults[2]);
        victim.push((form.sex.value) ? form.sex.value : defaults[3]);
		return victim;
	}
	
	this.update = function(element){
		
        var value = element.value;
        if(element.name == 'sex'){
            if(value == 'lass'){
               value = 'her';
                updateCurse('.' + element.name + '1', value);
            }else{
                value = defaults[2];
                updateCurse('.' + element.name + '1', defaults[3]);
            }
        }
        updateCurse('.' + element.name, value);
	};
    
    function updateCurse(selector, value){
        var nodes = document.querySelectorAll(selector);
        for( var i = 0; i < nodes.length; i++){
            nodes[i].style.color = '#ba3925';
            nodes[i].innerHTML = value;
        }
    }
    
};

/**
 * Init
 */
 var Jennet = new JennetCloustonCurse();
 
(function(window) {
    document.addEventListener('DOMContentLoaded', function(event) {
        document.getElementById('JennyCloustonsCurseForm').addEventListener('submit', function(e){e.preventDefault();Jennet.request(this);});
        document.getElementById('Name').addEventListener('keyup', function(){Jennet.update(this)});
        document.getElementById('Sex').addEventListener('change', function(){Jennet.update(this)});
        document.getElementById('House').addEventListener('keyup', function(){Jennet.update(this)});
        document.getElementById('JennyCloustonsCurse').innerHTML = Jennet.inject(defaults, 'strong');   
    });
})(window);
