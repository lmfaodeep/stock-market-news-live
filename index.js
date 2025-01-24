const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const newspapers = [
    {
        name: 'moneycontrol',
        address: 'https://www.moneycontrol.com/stocksmarketsindia/',
        base: 'https://www.moneycontrol.com' // Added the base URL
    },
    {
        name: 'toi',
        address: 'https://timesofindia.indiatimes.com/business/stock-market',
        base: 'https://timesofindia.indiatimes.com' // Added the base URL
    },
    {
        name: 'nse_india',
        address: 'https://www.nseindia.com/resources/exchange-communication-media-center',
        base: 'https://www.nseindia.com' // Added the base URL
    },
    {
        name: 'et',
        address: 'https://economictimes.indiatimes.com/',
        base: 'https://economictimes.indiatimes.com' // Added the base URL
    },
    {
        name: 'mint',
        address: 'https://www.livemint.com/latest-news',
        base: 'https://www.livemint.com' // Added the base URL
    }
];

const articles = [];

const fetchArticles = async (newspaper) => {
    try {
        const response = await axios.get(newspaper.address);
        const html = response.data;
        const $ = cheerio.load(html);

        $('a').filter(function () {
            return /stock|rise|fall|crash|high|low|surge|drop|dip|boost|plunge|climb|decline|jump|soar|setback|rally|slump|correction|rebound|slide|plummet|recover|skyrocket|tumble|fluctuate|stabilize|consolidate|bullish|bearish|volatility|stagnation|sentiment|oversold|overbought|panic|uptrend|downtrend|resistance|support|inflation|interest rate|economic slowdown|recession|recovery/i.test($(this).text());
        }).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            if (url) {
                // Construct full URL
                const fullUrl = url.startsWith('http') ? url : newspaper.base + url;
                articles.push({
                    title,
                    url: fullUrl,
                    source: newspaper.name
                });
            }
        });
    } catch (err) {
        console.log(`Error fetching articles from ${newspaper.name}:`, err);
    }
};

app.get('/', (req, res) => {
    res.json('Welcome to My CLIMATE CHANGE NEWS API');
});

// Fetch articles for all newspapers
app.get('/news', async (req, res) => {
    await Promise.all(newspapers.map(fetchArticles));
    res.json(articles);
});

// Fetch articles from a specific newspaper
app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaper = newspapers.find(n => n.name === newspaperId);

    if (!newspaper) {
        return res.status(404).json({ error: 'Newspaper not found' });
    }

    const specificArticles = [];
    try {
        const response = await axios.get(newspaper.address);
        const html = response.data;
        const $ = cheerio.load(html);

        $('a').filter(function () {
            return /stock|rise|fall|crash|high|low|surge|drop|dip|boost|plunge|climb|decline|jump|soar|setback|rally|slump|correction|rebound|slide|plummet|recover|skyrocket|tumble|fluctuate|stabilize|consolidate|bullish|bearish|volatility|stagnation|sentiment|oversold|overbought|panic|uptrend|downtrend|resistance|support|inflation|interest rate|economic slowdown|recession|recovery/i.test($(this).text());
        }).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            if (url) {
                const fullUrl = url.startsWith('http') ? url : newspaper.base + url;
                specificArticles.push({
                    title,
                    url: fullUrl,
                    source: newspaperId
                });
            }
        });
        res.json(specificArticles);
    } catch (err) {
        console.log(`Error fetching articles from ${newspaperId}:`, err);
        res.status(500).json({ error: 'Error fetching articles' });
    }
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
