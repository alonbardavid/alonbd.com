import mixpanel from 'mixpanel-browser';

const TRACKER_ID = '99f090d64dfd7b5a03c6d2541720a2a4';


export default ({
                  Vue, // the version of Vue being used in the VuePress app
                  options, // the options for the root Vue instance
                  router, // the router instance for the app
                  siteData // site metadata
                }) => {
  if (process.env.NODE_ENV === 'production') {
    mixpanel.init(TRACKER_ID);
    router.afterEach(function (to) {
      mixpanel.track("pageview", {page: to.fullPath})
    })
  }
}
