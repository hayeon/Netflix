import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Header from "./componets/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";
function App () {
  <>
  <Header></Header>
  <Router>
    <Switch>
      <Route path="/"><Home/></Route>
      <Route path="/tv"><Tv/></Route>
      <Route path="/search"><Search/></Route>
    </Switch>
  </Router>
  </>
}

export default App;