import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./componets/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

function App() {
  return (
      <Router>
        <Header />
        <Switch>
          <Route path="/tv">
            <Tv />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          {/* /는 항상 마지막에 2개의 path에서 같은 컴포넌트 렌더링 */}
          <Route path={["/", "/movies/:movie.id"]}>
            <Home />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
