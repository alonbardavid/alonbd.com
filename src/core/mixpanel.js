//code copied from mixpanel-browser package
function referringDomain(referrer) {
    var split = referrer.split('/');
    if (split.length >= 3) {
        return split[2];
    }
    return '';
}
function includes(str, needle) {
    return str.indexOf(needle) !== -1;
}
function browser(user_agent, vendor, opera) {
    vendor = vendor || ''; // vendor is undefined for at least IE9
    if (opera || includes(user_agent, ' OPR/')) {
        if (includes(user_agent, 'Mini')) {
            return 'Opera Mini';
        }
        return 'Opera';
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
        return 'BlackBerry';
    } else if (includes(user_agent, 'IEMobile') || includes(user_agent, 'WPDesktop')) {
        return 'Internet Explorer Mobile';
    } else if (includes(user_agent, 'Edge')) {
        return 'Microsoft Edge';
    } else if (includes(user_agent, 'FBIOS')) {
        return 'Facebook Mobile';
    } else if (includes(user_agent, 'Chrome')) {
        return 'Chrome';
    } else if (includes(user_agent, 'CriOS')) {
        return 'Chrome iOS';
    } else if (includes(user_agent, 'UCWEB') || includes(user_agent, 'UCBrowser')) {
        return 'UC Browser';
    } else if (includes(user_agent, 'FxiOS')) {
        return 'Firefox iOS';
    } else if (includes(vendor, 'Apple')) {
        if (includes(user_agent, 'Mobile')) {
            return 'Mobile Safari';
        }
        return 'Safari';
    } else if (includes(user_agent, 'Android')) {
        return 'Android Mobile';
    } else if (includes(user_agent, 'Konqueror')) {
        return 'Konqueror';
    } else if (includes(user_agent, 'Firefox')) {
        return 'Firefox';
    } else if (includes(user_agent, 'MSIE') || includes(user_agent, 'Trident/')) {
        return 'Internet Explorer';
    } else if (includes(user_agent, 'Gecko')) {
        return 'Mozilla';
    } else {
        return '';
    }
}


function browserVersion(browser,userAgent, vendor, opera) {
    var versionRegexs = {
        'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
        'Microsoft Edge': /Edge\/(\d+(\.\d+)?)/,
        'Chrome': /Chrome\/(\d+(\.\d+)?)/,
        'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
        'UC Browser': /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
        'Safari': /Version\/(\d+(\.\d+)?)/,
        'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
        'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
        'Firefox': /Firefox\/(\d+(\.\d+)?)/,
        'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
        'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
        'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
        'Android Mobile': /android\s(\d+(\.\d+)?)/,
        'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
        'Mozilla': /rv:(\d+(\.\d+)?)/
    };
    var regex = versionRegexs[browser];
    if (regex === undefined) {
        return null;
    }
    var matches = userAgent.match(regex);
    if (!matches) {
        return null;
    }
    return parseFloat(matches[matches.length - 2]);
}

function os(userAgent) {
    if (/Windows/i.test(userAgent)) {
        if (/Phone/.test(userAgent) || /WPDesktop/.test(userAgent)) {
            return 'Windows Phone';
        }
        return 'Windows';
    } else if (/(iPhone|iPad|iPod)/.test(userAgent)) {
        return 'iOS';
    } else if (/Android/.test(userAgent)) {
        return 'Android';
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
        return 'BlackBerry';
    } else if (/Mac/i.test(userAgent)) {
        return 'Mac OS X';
    } else if (/Linux/.test(userAgent)) {
        return 'Linux';
    } else {
        return '';
    }
}
function device(user_agent) {
    if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
        return 'Windows Phone';
    } else if (/iPad/.test(user_agent)) {
        return 'iPad';
    } else if (/iPod/.test(user_agent)) {
        return 'iPod Touch';
    } else if (/iPhone/.test(user_agent)) {
        return 'iPhone';
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
        return 'BlackBerry';
    } else if (/Android/.test(user_agent)) {
        return 'Android';
    } else {
        return '';
    }
}
export default class MixPanel {
    properties = {};

    constructor(token) {
        this.setupProperties({token});
    }

    setupProperties({token}) {
        const $browser = browser(navigator.userAgent, navigator.vendor, window.opera);
        Object.assign(this.properties, {
            'token':token,
            '$os': os(navigator.userAgent),
            '$browser': $browser,
            '$referrer': document.referrer,
            '$referring_domain': referringDomain(document.referrer),
            '$device': device(navigator.userAgent),
            '$browser_version': browserVersion($browser, navigator.userAgent, navigator.vendor, window.opera),
            '$screen_height': screen.height,
            '$screen_width': screen.width
        })
    }

    trackEvent(event, props = {}) {
        const data = {
            event,
            properties: Object.assign(this.properties, {
                '$current_url': window.location.href
            },props)
        };
        fetch(`//api.mixpanel.com/track/?data=${btoa(JSON.stringify(data))}&verbose=1`);
    }
}