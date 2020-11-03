import React from "react";
import {Link} from "react-router-dom";
import { Layout } from "antd";
import { Menu } from 'antd';
import { LaptopOutlined, WalletOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AppSider = () => (
  <Sider className="sider">
    <Menu theme={"dark"} >
      <Menu.Item icon={<WalletOutlined />} title="home">
        home
        <Link to="/"/>
      </Menu.Item>
      <SubMenu icon={<LaptopOutlined />} title="analysis">
        <Menu.Item key="stats">
          Stats
          <Link to="/stats"/>
        </Menu.Item>
        <Menu.Item key="prediction">
          Prediction
          <Link to="/model"/>
        </Menu.Item>
      </SubMenu>
    </Menu>
  </Sider>
);
  
export default AppSider;