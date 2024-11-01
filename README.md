# Discord Channel Summarizer

A web application that provides summaries of Discord channel messages. The app stores summaries locally and maintains a history of previous summaries.

## Features

- Fetch and summarize Discord channel messages
- Group messages by day
- Show message counts and unique users
- Identify most active users
- Find top discussion topics
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

**Important Security Note**: Your Discord token is sensitive information. Never share it with others. This application stores it only in memory and never saves it to localStorage.

## Using the Summarizer

1. Enter the Channel ID of the channel you want to summarize
2. Enter your Discord token
3. Click "Get Summary" to generate a summary of the channel's messages

## Deployment

1. Copy all files to your web server:
   - index.html
   - script.js
   - README.md

The application can be served from any static web server or file system.

## Local Storage

The application uses browser localStorage to maintain:
- Up to 10 most recent summaries
- Channel IDs and timestamps for each summary

## Features

- Message summarization by day
- Most active users identification
- Top discussion topics
- Message count statistics
- Previous summaries history
- Dark mode UI matching Discord's theme

## Limitations

- Can only access channels you have permission to read
- Fetches up to 100 most recent messages per request
- Summaries are stored locally in the browser

## Privacy & Security

This application:
- Only accesses channels you have permission to read
- Stores data locally in your browser
- Never saves your Discord token
- Makes requests directly to Discord's API
