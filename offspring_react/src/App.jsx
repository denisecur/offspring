import React from "react";
import { Col, Layout, Row } from "antd";
import AppHeader from "./components/Header/AppHeader";
import AppRoutes from "./Routes";
import DrawerAppBar from "./components/Header/DrawerAppBar.jsx"
const { Header, Content } = Layout;

const App = () => {
  return (
    <DrawerAppBar/>
  );
};

export default App;