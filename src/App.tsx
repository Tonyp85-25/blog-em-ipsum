
import './App.css'
import { Posts } from './Posts';

function App() {
 
  return (
    // provide React Query client to App
    <div className="App">
      <h1>Blog Posts</h1>
      <Posts />
    </div>
  );
}

export default App
