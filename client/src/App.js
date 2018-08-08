import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import { Container } from "./components/Grid";
import Spending from "./pages/Spending";
import Bills from "./pages/Bills";
import Organizer from "./pages/Organizer";
import "./App.css";



const App = () => (
  <Router>
    <div> 
      <Container>
        <Nav />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/spending" component={Spending} />
          <Route exact path="/bills" component={Bills} />
          <Route exact path="/organizer" component={Organizer} />
          {/* <Route component={NoMatch} /> */}
        </Switch>
      </Container>
    </div>
  </Router>
  
);

export default App;
