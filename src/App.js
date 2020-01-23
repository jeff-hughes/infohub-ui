import React, { Fragment } from 'react';
import { 
    HashRouter as Router, 
    Switch, 
    Route, 
    Link,
    Redirect,
    useParams
} from 'react-router-dom';

import './App.css';

//const FETCH_DELAY = 5;  // delay in seconds between fetching news items
var test_id_counter = 3; // incremented with each call of dummyAJAXResponse()

var json = {
    'news': [
        { 'id': 1, 'source': 'Hacker News', 'title': '1337 haX0rs are 1337', 'text': "Turns out I don't understand hacking either" },
        { 'id': 2, 'source': 'ESPN', 'title': 'Sportsball champions win the sportsball tournament again!', 'text': "I don't understand teh sports" }
    ]
}

function dummyAJAXResponse(userId, timestamp) {
    var item = [{ 'id': test_id_counter, 'source': 'Generic News', 'title': 'Things happened again today', 'text': "Some things happened. Then other things happened as well. It was an exciting occasion." }];
    test_id_counter++;
    return item;
}


const UserContext = React.createContext();

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                userId: null,
                name: 'Guest'
            }
        }
    }

    render() {
        return (
            <Router>
            <UserContext.Provider value={this.state.user}>
                <div className="App">
                    <SearchBar />
                    <Switch>
                        <Route path="/overview/:itemId">
                            <OverviewPage />
                        </Route>
                        <Route path="/search/:terms">
                            <SearchPage />
                        </Route>
                        <Route path="/">
                            <HomePage />
                        </Route>
                    </Switch>
                </div>
            </UserContext.Provider>
            </Router>
        );
    }
}


// HOME COMPONENTS -----------------------------------------------

// TODO: Need to update endpoints with REST API endpoints
function HomePage() {
    return (
        <Fragment>
            <h2 class="font-regular">In the News</h2>
            <NewsFeed endpoint={null} items={json.news} />
            <h2 class="font-regular">At ESDC</h2>
            <ESDCFeed endpoint={null} items={json.news} />
            <h2 class="font-regular">Recommended for You</h2>
            <RecommendFeed endpoint={null} items={json.news} />
        </Fragment>
    );
}

/**
 * This abstract class forms the basis for multiple feed components and
 * defines the basic functionality for making AJAX requests to update
 * feeds
 */
class Feed extends React.Component {
    constructor(props) {
        super(props);

        // set any initial state coming from the props
        this.state = {
            endpoint: this.props.endpoint,
            items: this.props.items,
            userId: null,
            timestamp: null
        }

        this.fetchItems = this.fetchItems.bind(this);
    }

    fetchItems() {
        // TODO: will set up to use this.endpoint
        var newItems = dummyAJAXResponse(this.state.userId, this.state.timestamp);
        json.news = json.news.concat(newItems);
        this.setState(state => {
            return { items: state.items.concat(newItems) };
        });
    }

    getItems() {
        return this.state.items.slice()  // shallow copy of array
            .sort((a, b) => b - a);      // sort descending
    }
}

class NewsFeed extends Feed {
    //componentDidMount() {
        //setInterval(() => {
            //this.fetchItems();
        //}, FETCH_DELAY*1000);
    //}

    render() {
        var listItems = this.getItems()
            .map((item) =>
                <NewsItem
                    key={item.id}
                    id={item.id}
                    source={item.source}
                    title={item.title}
                    text={item.text}
                />
            );
        return (
            <Fragment>
                <a href="#" className="simfetch" onClick={this.fetchItems}>Simulate fetch</a>
                <ul className="NewsFeed">{listItems}</ul>
            </Fragment>
        );
    }
}

class ESDCFeed extends Feed {
    render() {
        var listItems = this.getItems()
            .map((item) =>
                <NewsItem
                    key={item.id}
                    id={item.id}
                    source={item.source}
                    title={item.title}
                    text={item.text}
                />
            );
        return <ul className="ESDCFeed">{listItems}</ul>;
    }
}

class RecommendFeed extends Feed {
    render() {
        var listItems = this.getItems()
            .map((item) =>
                <NewsItem
                    key={item.id}
                    id={item.id}
                    source={item.source}
                    title={item.title}
                    text={item.text}
                />
            );
        return <ul className="RecommendFeed">{listItems}</ul>;
    }
}

/**
 * Defines the component for a news item as a whole, including all
 * peripheral elements (e.g., overview link)
 */
function NewsItem(props) {
    return (
        <li className="NewsItem">
            <div>
                <NewsSummary
                    id={props.id}
                    source={props.source}
                    title={props.title}
                    text={props.text}
                />
                <p><Link to={"/overview/"+props.id} class="btn btn-xs cyan lighten-1">Overview</Link></p>
            </div>
        </li>
    );
}

function NewsSummary(props) {
    return (
        <div className="NewsSummary">
            <h3 className="title">{props.title}</h3>
            <p className="source">{props.source}</p>
            <p className="text">{props.text}</p>
        </div>
    );
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            search_terms: ''
        };
    }

    searchSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true, search_terms: document.getElementById('SearchBar').value });
    }

    render() {
        if (this.state.submitted) {
            return <Redirect to={"/search/"+this.state.search_terms} />;
        } else {
            return (
                <form onSubmit={this.searchSubmit.bind(this)}>
                    <div class="SearchBarContainer container-fluid">
                        <div class="row">
                            <div class="col-xs-10"><input type="text" className="SearchBar" id="SearchBar" /></div>
                            <div class="col-xs-2"><input type="submit" className="SearchSubmit cyan" value="Search" /></div>
                        </div>
                    </div>
                </form>
            );
        }
    }
}



// OVERVIEW COMPONENTS -----------------------------------------------

function OverviewPage() {
    let { itemId } = useParams();

    let item = json.news[itemId-1];  // TODO: this will actually need a DB query

    return (
        <Fragment>
            <NewsSummary
                key={item.id}
                id={item.id}
                source={item.source}
                title={item.title}
                text={item.text}
            />
            <h2>Related News</h2>
            <p>Other news items here</p>
        </Fragment>
    );
}



// SEARCH COMPONENTS -----------------------------------------------

function SearchPage() {
    let { terms } = useParams();

    return <p>You searched for {terms}</p>;
}





export default App;
