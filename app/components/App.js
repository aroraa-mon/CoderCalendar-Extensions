const React = require('react');

const $ = require('jquery');
const Router = require('./Router');
const Header = require('./Header');
const store = require('../store');
const { SUPPORTED_PLATFORMS } = require('../constants');

const App = React.createClass({
  getInitialState() {
    return {
      isLoading: false,
      route: 'listings',
    };
  },
  getContestList() {
    ga('send', 'event', 'Refresh');

    this.setState({
      isLoading: true,
    });

    const component = this;
    $.when($.ajax('https://contesttrackerapi.herokuapp.com/')).then((data) => {
      const contests = data.result;

      store.setContests(contests);

      component.setState({
        isLoading: false,
      });
    }, () => {
      component.setState({
        isLoading: false,
      });
    });
  },

  onClickSettingsHandler() {
    ga('send', 'pageview', '/settings.html');
    this.setState({ route: 'settings' });
  },
  onClickArchiveHandler() {
    ga('send', 'pageview', '/archive.html');
    this.setState({ route: 'archive' });
  },
  onClickListingsHandler() {
    this.setState({ route: 'listings' });
  },
  onClickHelpHandler() {
    ga('send', 'pageview', '/help.html');
    this.setState({ route: 'help' });
  },
  onClickDonateHandler() {
    ga('send', 'pageview', '/donate.html');
    this.setState({ route: 'donate' });
  },

  componentDidMount() {
    // Initialize Platform settings
    SUPPORTED_PLATFORMS
      .filter(p => !store.isPlatformInitialized(p))
      .forEach(p => store.enablePlatform(p));

    // Initialize Hidden Contest List
    if (!store.isHiddenListInitialized()) {
      store.initializeHiddenList();
    }

    if (store.isContestsDataEmpty() || store.isContestsDataStale(5)) {
      this.getContestList();
    }
  },
  render() {
    return (
      <div>
        <Header
          onClickRefresh={this.getContestList}
          onClickSettings={this.onClickSettingsHandler}
          onClickArchive={this.onClickArchiveHandler}
          onClickListings={this.onClickListingsHandler}
          onClickHelp={this.onClickHelpHandler}
          onClickDonate={this.onClickDonateHandler}
          isLoading={this.state.isLoading}
        />
        <Router route={this.state.route} />
      </div>
    );
  },
});

module.exports = App;
