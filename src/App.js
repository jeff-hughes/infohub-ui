import React, { useState } from 'react';
import './App.css';

const FETCH_DELAY = 5;  // delay in seconds between fetching news items

var json = {
    'news': [
        { 'source': 'ESPN', 'title': 'Sportsball champions win the sportsball tournament again!', 'text': "I don't understand teh sports" },
        { 'source': 'Hacker News', 'title': '1337 haX0rs are 1337', 'text': "Turns out I don't understand hacking either" }
    ]
}

function dummyAJAXResponse(userId, timestamp) {
    return [{ 'source': 'Generic News', 'title': 'Things happened again today', 'text': "Some things happened. Then other things happened as well. It was an exciting occasion." }];
}

function App() {
    return (
        <div className="App">
            <NewsFeed />
        </div>
    );
}

function NewsFeed() {
    const [items, setItems] = useState(json.news);
    var listItems = items.map((item) =>
        <NewsItem source={item.source} title={item.title} text={item.text} />
    );

    setInterval(() => { 
        var newItems = dummyAJAXResponse(null, null);
        setItems(newItems.concat(items));
    }, FETCH_DELAY*1000);

    return <ul className="NewsFeed">{listItems}</ul>;
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

export default App;
