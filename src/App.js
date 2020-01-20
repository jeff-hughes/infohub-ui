import React from 'react';
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
        <div className="App">
            <SearchBar />
            <NewsFeed />
        </div>
    );
}

class NewsFeed extends React.Component {
    constructor(props) {
        super(props);

        // putting this here for now, but eventually this will
        // be pulled from an AJAX request after component has
        // mounted
        this.state = {
            items: json.news
        };
    }

    componentDidMount() {
        setInterval(() => {
            var newItems = dummyAJAXResponse(null, null);
            this.setState(state => {
                return { items: state.items.concat(newItems) };
            });
        }, FETCH_DELAY*1000);
    }

    render() {
        var listItems = this.state.items.slice()  // shallow copy of array
            .sort((a, b) => b - a)                // sort descending
            .map((item) =>
                <NewsItem key={item.id} source={item.source} title={item.title} text={item.text} />
            );
        return <ul className="NewsFeed">{listItems}</ul>;
    }
}

function NewsItem(props) {
    return (
        <li className="NewsItem">
            <div>
                <h3 className="title">{props.title}</h3>
                <p className="source">{props.source}</p>
                <p className="text">{props.text}</p>
            </div>
        </li>
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

export default App;
