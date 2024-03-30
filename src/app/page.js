// pages/index.js
import LatestPosts from './components/LatestPosts';
import Header from './components/header';

export default function HomePage() {
  return (
    <div>
      <Header />
      <LatestPosts />
    </div>
  );
}
