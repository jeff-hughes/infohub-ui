import React from 'react';
import { 
    HashRouter as Router, 
    Switch, 
    Route, 
    Link,
    useParams
} from 'react-router-dom';

import './App.css';

const FETCH_DELAY = 5;  // delay in seconds between fetching news items
var test_id_counter = 3; // incremented with each call of dummyAJAXResponse()

var json = {
    'news': [
        { 'id': 1, 'source': 'ESPN', 'title': 'Sportsball champions win the sportsball tournament again!', 'text': "I don't understand teh sports" },
        { 'id': 2, 'source': 'Hacker News', 'title': '1337 haX0rs are 1337', 'text': "Turns out I don't understand hacking either" }
    ]
}

function dummyAJAXResponse(userId, timestamp) {
    var item = [{ 'id': test_id_counter, 'source': 'Generic News', 'title': 'Things happened again today', 'text': "Some things happened. Then other things happened as well. It was an exciting occasion." }];
    test_id_counter++;
    return item;
}


function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/overview/:itemId">
                        <OverviewPage />
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}


// HOME COMPONENTS -----------------------------------------------

// TODO: Need to update endpoints with REST API endpoints
function HomePage() {
    return (
        <div>
            <SearchBar />
            <h2>In the News</h2>
            <NewsFeed endpoint={null} items={json.news} />
            <h2>At ESDC</h2>
            <ESDCFeed endpoint={null} items={json.news} />
            <h2>Recommended for You</h2>
            <RecommendFeed endpoint={null} items={json.news} />
        </div>
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
            items: this.props.items
        }
    }

    fetchItems(userId, timestamp) {
        // TODO: will set up to use this.endpoint
        var newItems = dummyAJAXResponse(userId, timestamp);
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
    componentDidMount() {
        setInterval(() => {
            this.fetchItems(null, null);
        }, FETCH_DELAY*1000);
    }

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
        return <ul className="NewsFeed">{listItems}</ul>;
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
                <p><Link to={"/overview/"+props.id}>Overview</Link></p>
            </div>
        </li>
    );
}

function NewsSummary(props) {
    return (
        <div>
            <h3 className="title">{props.title}</h3>
            <p className="source">{props.source}</p>
            <p className="text">{props.text}</p>
        </div>
    );
}

function SearchBar() {
    return (
        <form>
            <input type="text" className="SearchBar" />
            <input type="submit" className="SearchSubmit" value="Search" />
        </form>
    );
}



// OVERVIEW COMPONENTS -----------------------------------------------

function OverviewPage() {
    let { itemId } = useParams();

    let item = json.news[itemId-1];  // TODO: this will actually need a DB query

    return (
        <div>
            <NewsSummary
                key={item.id}
                id={item.id}
                source={item.source}
                title={item.title}
                text={item.text}
            />
            <h2>Related News</h2>
            <p>Other news items here</p>
        </div>
    );
}




export default App;
