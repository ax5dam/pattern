/*

Pattern v2.1
A vanilla JavaScript router utilizing the HTML5 history API. Compatible with modern browsers only (ES6+).
https://github.com/adamwjohnson5/pattern
By Adam Johnson
MIT License 2019

Usage:

Pattern.init();

history.pushState(null, null, 'about'); // Change URL with pushState

*/

"use strict";

class Pattern {
    static init(rootPath) { // Root path optional
        window.section; // Global var
        
        // Listen for URL change
        window.addEventListener('popstate', () => {
            // Browser back or forward fired
            urlHandler(rootPath);
        });
        
        const pushState = history.pushState;
        
        history.pushState = function() {
            pushState.apply(history, arguments);
            urlHandler(rootPath);
        };
        
        urlHandler(rootPath); // Fire on init
    }
}

function urlHandler(rootPath) {
    // Get section
    var urlSection = location.pathname.replace(rootPath, ''); // Remove root path
    urlSection = urlSection.replace('/', '');
    
    // Check for params
    if (urlSection.indexOf('?') !== -1) {
        urlSection = urlSection.substr(0, urlSection.indexOf('?')); // Remove params from section
    }
    
    // Rename to 'home' if section empty
    if (! urlSection) {
        urlSection = 'home';
    }
    
    window.section = urlSection; // Set section global var
    
    // Get URL params
    var urlParams = location.search.split('?').pop();
    urlParams = new URLSearchParams(urlParams);
    
    // Loop all params and create global vars
    for (let x of urlParams.entries()) {
        window[x[0]] = x[1]; // Set global var
    }
    
    // Call section function if exists
    const func = window[urlSection + 'Load'];
    
    if (typeof func === 'function') {
        func();
    } else if (typeof rewriteLoad === 'function') { // Check for rewrite func
        rewriteLoad(); // Use to call other load function
    }
}