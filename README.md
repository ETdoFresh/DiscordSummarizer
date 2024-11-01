# Discord Channel Summarizer

A web application that provides AI-powered summaries of Discord channel messages using OpenRouter's API. The app stores summaries locally and maintains a history of previous summaries.

## Features

- AI-powered summarization of Discord channel messages
- Group messages by day with detailed statistics
- Show message counts and unique users
- Identify most active users and key discussion topics
- Store summary history using localStorage
- Discord-like dark theme UI

## Setup Instructions

### 1. Enable Developer Mode in Discord

1. Open Discord
2. Go to User Settings
3. Navigate to App Settings > Advanced
4. Enable Developer Mode

### 2. Get Channel ID

1. Right-click on the channel you want to summarize
2. Select "Copy ID" at the bottom of the context menu

### 3. Get Your Discord Token

1. Open Discord in your web browser
2. Press F12 to open Developer Tools
3. Go to the Network tab
4. Click any channel in Discord
5. Look for a request to "messages"
6. In the request headers, find and copy the "authorization" value

### 4. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account or sign in
3. Navigate to your API settings
4. Generate and copy your API key

**Important Security Note**: Your Discord token and OpenRouter API key are sensitive information. Never share them with others. This application stores them only in memory and never saves them to localStorage.

## Using the Summarizer

1. Enter the Channel ID of the channel you want to summarize
2. Enter your Discord token and OpenRouter API key
3. Select the date range for messages to summarize
4. Click "Get Summary" to generate an AI-powered summary of the channel's messages

## Project Structure

```
├── css/
│   ├── base.css
│   ├── content.css
│   ├── forms.css
│   ├── layout.css
│   ├── markdown.css
│   ├── status.css
│   └── utilities.css
├── js/
│   ├── api/
│   │   ├── discordApi/
│   │   └── openRouterApi/
│   ├── discordSummarizer/
│   ├── main/
│   ├── ui/
│   └── utils/
└── index.html
```

## Local Storage

The application uses browser localStorage to maintain:
- Up to 10 most recent summaries
- Channel IDs and timestamps for each summary
- Previous search parameters (except sensitive credentials)

## Limitations

- Can only access Discord channels you have permission to read
- Fetches up to 100 messages per API request
- Summaries are stored locally in your browser
- API rate limits apply for both Discord and OpenRouter

## Privacy & Security

This application:
- Only accesses channels you have permission to read
- Stores data locally in your browser
- Never saves your Discord token or OpenRouter API key
- Makes requests directly to Discord and OpenRouter APIs
- Does not collect or transmit any personal information
