import Parser from 'rss-parser';
import { formatDate } from '../lib/dateUtils';
import { feedUrls } from '../data/feedUrls';

const rssParser = new Parser();

export async function getFeeds(feedUrls) {
  return await Promise.all(feedUrls.map(async (feed) => {
    try {
      const res = await fetch(feed.url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch data');
      const text = await res.text();
      const feedData = await rssParser.parseString(text);
      const posts = feedData.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      if (!posts[0]) {
        console.error('No posts found for feed:', feed.url);
        return null;
      }

      return { post: posts[0], feedTitle: feedData.title, feedLink: feedData.link, lastBuildDate: feedData.lastBuildDate };

    } catch (err) {
      console.error(`Error fetching from ${feed.url}:`, err);
      return null;
    }
  }));
}

export default async function LatestPosts() {
  const feeds = await getFeeds(feedUrls).catch(err => {
    console.error('Error fetching posts:', err);
    return []; // Return empty array on error
  });

  // Filter out null values (failed fetches)
  let validFeeds = feeds.filter(post => post !== null);

  // Validate the feed items before sorting
  validFeeds = validFeeds.map(feed => {
    try {
      const now = new Date();

      // Ensure post.pubDate is valid
      let pubDate = new Date(feed.post.pubDate);
      if (!pubDate || isNaN(pubDate.getTime()) || pubDate > now) {
        const lastBuildDate = new Date(feed.lastBuildDate);
        if (!isNaN(lastBuildDate.getTime()) && lastBuildDate <= now) {
          feed.post.pubDate = feed.lastBuildDate;
        } else {
          feed.post.pubDate = new Date().toISOString(); // assign current date as default
        }
      }

      // Assign the site URL as the post URL if none is present
      if (!feed.post.link) {
        feed.post.link = feed.feedLink; 
      }

      return feed;

    } catch (err) {
      console.error(`Error processing feed: ${err}`);
      return null;
    }
  });

  // Sort posts in reverse chronological order
  const sortedFeeds = validFeeds.sort((a, b) => new Date(b.post.pubDate) - new Date(a.post.pubDate));

  // Render latest post from each feed
  return (
    <div>
      <ul>
        {sortedFeeds.map((feed, index) => (
          <li key={index}>
            <a href={feed.post.link} 
               target='_blank' 
               rel='noopener noreferrer'
               className='block border-b border-slate-100 p-3 text-slate-800 hover:bg-slate-100'
            >
              <div className='flex lg:gap-x-3'>
                <div className='flex grow flex-wrap items-center justify-start overflow-hidden text-sm lg:flex-nowrap lg:gap-x-3 lg:text-base'>
                  <h3 className='line-clamp-1 basis-1/2 font-bold lg:shrink-0 lg:basis-64'>
                    {feed.feedTitle}
                  </h3>
                  <h3 className='ml-auto shrink-0 basis-1/2 text-right text-slate-400 lg:order-5 lg:basis-auto'>
                    {formatDate(new Date(feed.post.pubDate))}
                  </h3>
                  <h3 className='basis-full lg:basis-auto lg:shrink-0'>
                    {feed.post.title}
                  </h3>
                  <h3 className='line-clamp-2 text-slate-500 lg:truncate'>
                    {feed.post.contentSnippet}
                  </h3>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
