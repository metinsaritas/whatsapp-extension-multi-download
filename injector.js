var libs = [
    "lib/jquery.min.js",
    "lib/jszip.min.js",
    "lib/FileSaver.min.js",
    "content.js"
];

libs.forEach(function(val, i) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(val);
    s.onload = function() {
        this.remove();
    };
    document.body.appendChild(s);
})
