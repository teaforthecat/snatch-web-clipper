import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';
import SendSelectedComponent from './SendSelectedCompontent'

function setupReducer(action) {
  switch (action.state) {
  case true:
    return true
  case false:
    return false
  default:
    console.log("OOPS!")
  }
}

function App() {

  const [setupComplete, dispatchSetupComplete] = useReducer(setupReducer)

  //wip
  if (setupComplete) {
    return <div>hello world</div>
  } else if (false) {
    // TODO add configuration page
      // <NotionSetupComponent dispatchSetupComplete={dispatchSetupComplete}/>
  } else if (true) {
      return <SendSelectedComponent/>
  } else {
    return (
        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
        >
        Learn React
      </a>
        </header>
        </div>
    );

  }
}

export default App;
