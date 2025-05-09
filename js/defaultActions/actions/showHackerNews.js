export default /** @type {defineAction} */ (x=>x)({
  name: "showHackerNews",
  description: "Fetches and displays the top Hacker News stories in a sidebar",
  parameters: {
    type: "object",
    properties: {}
  },
  permissions: {
    autoExecute: true,
    autoContinue: false
  },
  action_fn: async function ({log}) {
    // Fetch Hacker News stories
    const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = await topStoriesResponse.json();
    
    // Fetch details for top stories
    const storyPromises = topStoryIds.slice(0, 30).map(async (id) => {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResponse.json();
    });
    
    const stories = await Promise.all(storyPromises);
    
    // Create the main container
    const container = document.createElement('div');
    container.style.cssText = `
      background: white;
      box-shadow: -2px 0 5px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Hacker News';
    title.style.cssText = `
      color: #FF6600;
      border-bottom: 2px solid #FF6600;
      padding-bottom: 10px;
      margin-bottom: 15px;
    `;
    container.appendChild(title);
    
    // Create stories list
    stories.forEach((story, index) => {
      const storyElement = document.createElement('div');
      storyElement.style.cssText = `
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
      `;
      
      const titleLink = document.createElement('a');
      titleLink.href = story.url;
      titleLink.textContent = story.title;
      titleLink.target = '_blank';
      titleLink.style.cssText = `
        color: #000;
        text-decoration: none;
        font-size: 16px;
        display: block;
        margin-bottom: 5px;
      `;
      
      const metaInfo = document.createElement('div');
      metaInfo.textContent = `${story.score} points by ${story.by} | ${story.descendants || 0} comments`;
      metaInfo.style.cssText = `
        color: #888;
        font-size: 12px;
      `;
      
      storyElement.appendChild(titleLink);
      storyElement.appendChild(metaInfo);
      
      container.appendChild(storyElement);
    });
    
    return container;
  }
});