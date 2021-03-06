(function() {
    var tabWidth = +localStorage.getItem('tabWidth') || 4;
    var minTabWidth = 2;
    var tabStep = 2;

    var glyphWidth = (function() {
        var tester = document.createElement('span');
        tester.innerHTML = '0';
        tester.style.position = 'absolute';
        tester.style.visibility = 'hidden';
        document.body.appendChild(tester);
        var width = tester.offsetWidth;
        document.body.removeChild(tester);
        return width;
    }());

    var rules = (function() {
        var sheet = [].filter.call(document.styleSheets, function(s) { return s.href && s.href.indexOf('visual') >= 0; })[0];
        var result = [];

        if (!sheet.cssRules) {
            return result;
        }

        for (var i = 0; i < sheet.cssRules.length; i++) {
            var rule = sheet.cssRules[i];
            if (rule.selectorText === '.array-content, .object-content') {
                result.push(rule);
            }
        }
        return result;
    }());

    function setTabWidth(width) {
        tabWidth = Math.max(width, minTabWidth);

        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            rule.style.paddingLeft = (glyphWidth * (tabWidth)) + 'px';
        }

        localStorage.setItem('tabWidth', tabWidth);
    }

    function expandTabWidth() {
        setTabWidth(tabWidth + tabStep);
    }

    function collapseTabWidth() {
        setTabWidth(tabWidth - tabStep);
    }

    $(document).on(
        'keydown',
        function(e) {
            if (!isInVisualMode()) {
                return;
            }

            if (e.which === 9) {
                if (e.shiftKey) {
                    collapseTabWidth();
                }
                else {
                    expandTabWidth();
                }
                return false;
            }
        }
    );

    addToolbarItem({
        name: 'tab-collapse',
        text: '减小缩进',
        click: collapseTabWidth
    });
    addToolbarItem({
        name: 'tab-expand',
        text: '增大缩进',
        click: expandTabWidth
    });

    setTabWidth(tabWidth);
}());