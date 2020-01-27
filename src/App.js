import React, { Fragment } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    withRouter
} from 'react-router-dom';

import './App.css';

// API endpoints for AJAX requests
const ENDPOINTS = {
    newsfeed: null,
    esdcfeed: null,
    recommendfeed: null
};

//const FETCH_DELAY = 5;  // delay in seconds between fetching news items
var test_id_counter = 3; // incremented with each call of dummyAJAXResponse()

var json_initial = {
    'news': [
        { 'id': 1, 'source': 'Hacker News', 'title': '1337 haX0rs are 1337', 'text': "Turns out I don't understand hacking either" },
        { 'id': 2, 'source': 'ESPN', 'title': 'Sportsball champions win the sportsball tournament again!', 'text': "I don't understand teh sports" }
    ]
}
var json_updated = JSON.parse(JSON.stringify(json_initial));  // deep copy of json_initial

function dummyAJAXResponse(userId, timestamp) {
    let item = [{ 'id': test_id_counter, 'source': 'Generic News', 'title': 'Things happened again today', 'text': "Some things happened. Then other things happened as well. It was an exciting occasion." }];
    test_id_counter++;
    return item;
}


function AppContainer() {
    return (
        <Router>
            <AppWithRouter />
        </Router>
    );
}


const UserContext = React.createContext();

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                userId: null,
                name: 'Guest'
            },
            search_terms: ''
        }
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    searchSubmit(terms) {
        this.setState({ search_terms: terms });
    }

    render() {
        // deal with SearchBar details and pass it along to all pages;
        // this lets us control its state without having to pass all its props
        // through the page props
        let terms = this.state.search_terms;
        if (!this.props.location.pathname.startsWith('/search/')) {
            terms = '';
        }
        const searchBar = <SearchBarWithRouter onSearchSubmit={this.searchSubmit} search_terms={terms} />;

        return (
            <UserContext.Provider value={this.state.user}>
                <div className="App">
                    <h1 className="MainTitle">Infohub</h1>
                    <Switch>
                        <Route path="/overview/:itemId">
                            <OverviewPage searchBar={searchBar} />
                        </Route>
                        <Route path="/search/:terms">
                            <SearchPage searchBar={searchBar} />
                        </Route>
                        <Route path="/">
                            <HomePage searchBar={searchBar} />
                        </Route>
                    </Switch>
                </div>
            </UserContext.Provider>
        );
    }
}
const AppWithRouter = withRouter(App);


// HOME COMPONENTS -----------------------------------------------

// TODO: Need to update endpoints with REST API endpoints
class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newsfeed: json_initial.news,
            esdcfeed: json_initial.news,
            recommendfeed: json_initial.news,
            timestamp: null
        };

        this.fetchAllFeeds = this.fetchAllFeeds.bind(this);
    }

    //componentDidMount() {
    //setInterval(() => {
    //this.fetchAllFeeds();
    //}, FETCH_DELAY*1000);
    //}

    fetchAllFeeds() {
        // for (const [feed, endpoint] of Object.entries(ENDPOINTS)) {
        //     this.fetchItems(feed, endpoint);
        // }
        this.fetchItems('newsfeed', ENDPOINTS.newsfeed);
    }

    fetchItems(feed, endpoint) {
        // TODO: change this to real AJAX request using endpoint
        let newItems = dummyAJAXResponse(this.context.userId, this.state.timestamp);
        this.setState(state => {
            let obj = {};
            json_updated.news = json_updated.news.concat(newItems);
            obj[feed] = state[feed].concat(newItems);
            return obj;
        });
    }

    getItems(items) {
        return items.slice()         // shallow copy of array
            .sort((a, b) => b - a);  // sort descending
    }

    render() {
        return (
            <Fragment>
                {this.props.searchBar}
                <div className="HomePage">
                    <a href="#" className="simfetch" onClick={this.fetchAllFeeds}>Simulate fetch</a>
                    <h2 className="font-regular">In the News</h2>
                    <NewsFeed items={this.getItems(this.state.newsfeed)} />
                    <h2 className="font-regular">At ESDC</h2>
                    <NewsFeed items={this.getItems(this.state.esdcfeed)} />
                    <h2 className="font-regular">Recommended for You</h2>
                    <NewsFeed items={this.getItems(this.state.recommendfeed)} />
                </div>
            </Fragment>
        );
    }
}

function NewsFeed(props) {
    let listItems = props.items
        .map((item) =>
            <li key={item.id}>
                <NewsItem
                    id={item.id}
                    source={item.source}
                    title={item.title}
                    text={item.text}
                    showMeta={true}
                />
            </li>
        );
    return <ul className="NewsFeed">{listItems}</ul>;
}

function NewsItem(props) {
    return (
        <div className="NewsItem">
            <div className="NewsSummary">
                <h3 className="title">{props.title}</h3>
                <p className="source">{props.source}</p>
                <p className="text">{props.text}</p>
            </div>
            {props.showMeta &&
                <p><Link to={"/overview/" + props.id} className="btn btn-xs cyan lighten-1">Overview</Link></p>
            }
        </div>
    );
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.search_terms };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    searchSubmit(e) {
        e.preventDefault();
        let search_terms = document.getElementById('SearchBar').value;
        if (search_terms !== '') {
            this.props.onSearchSubmit(search_terms);
            this.props.history.push("/search/" + search_terms);  // redirect to search page
        }
    }

    render() {
        return (
            <form onSubmit={this.searchSubmit.bind(this)}>
                <div className="SearchBarContainer container-fluid">
                    <div className="row">
                        <div className="col-xs-10"><input type="text" className="SearchBar" id="SearchBar" value={this.state.value} onChange={this.handleChange} /></div>
                        <div className="col-xs-2"><input type="submit" className="SearchSubmit cyan" value="Search" /></div>
                    </div>
                </div>
            </form>
        );
    }
}
const SearchBarWithRouter = withRouter(SearchBar);



// OVERVIEW COMPONENTS -----------------------------------------------

function OverviewPage(props) {
    let { itemId } = useParams();

    let item = json_updated.news[itemId - 1];  // TODO: this will actually need a DB query

    return (
        <Fragment>
            {props.searchBar}
            <div className="OverviewPage">
                <NewsItem
                    key={item.id}
                    id={item.id}
                    source={item.source}
                    title={item.title}
                    text={item.text}
                    showMeta={false}
                />
                <h2>Related News</h2>
                <p>Other news items here</p>
            </div>
        </Fragment>
    );
}



// SEARCH COMPONENTS -----------------------------------------------

function SearchPage(props) {
    let { terms } = useParams();

    return (
        <Fragment>
            {props.searchBar}
            <div className="SearchPage">
                <p>You searched for "{terms}"</p>
            </div>
        </Fragment>
    );
}


export default AppContainer;
