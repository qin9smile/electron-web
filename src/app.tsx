import * as React from 'react';
import * as ReactDOM from "react-dom";
import {
  Router,
  Route,
  Link
} from 'react-router-dom';
import { AppContext } from './base/appcontext';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)


console.log(AppContext.history());
const About = () => (
  <div>
    <h2>About</h2>
    <button onClick={() => { AppContext.history().goBack()}}>back</button>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

  </div>
)

const BasicExample = () => (
  <Router history={AppContext.history()}>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>
      <Route path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)

ReactDOM.render(<BasicExample />, document.getElementById("app") as HTMLElement);