import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "./App.css";
import { Layout } from "antd";
import AppHeader from "./header";
import AppSider from "./sider";
import Charts from "./charts";
import Model from "./model";
import Home from "./home";

const { Content } = Layout;

const App = () => {
  return (
      <Router>
        <Layout>
          <AppHeader/>
            <Layout>
              <AppSider/>
                <Content>
                    <Switch>
                    <Route
                      exact
                      path="/"
                      component={Home}
                    />
                    <Route
                      exact
                      path="/stats"
                      component={Charts}
                    />
                    <Route
                    exact
                    path="/model"
                    component={Model}
                    />
                  </Switch>
                </Content>
            </Layout>
        </Layout>
      </Router>
  );                
};

export default App;