import React from "react";
import { Col, Layout, Row } from "antd";
import AppHeader from "./components/Header/AppHeader";
import AppRoutes from "./Routes";
const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout className="bg-green-300">
      <Row gutter={[0, 32]} className="bg-yellow-300">
        <Col span={4}>
          <Header>
            <AppHeader />
          </Header>
        </Col>
        <Col span={22} offset={1} className="bg-red-300">
          <Content>
            <AppRoutes />
          </Content>
        </Col>
      </Row>
    </Layout>
  );
};

export default App;