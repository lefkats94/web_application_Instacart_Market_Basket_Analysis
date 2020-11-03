import React, { useEffect, useState } from 'react';
import {ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
import getStats from "./Stats";
import {Typography} from "antd";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const { Title } = Typography;

const StatsPage = () => {
  const [orders, setorders] = useState([]);
  const [products,setproducts] = useState([]);
  const [past,setpast] = useState([]);

  const ordersbar = (preordersbar) =>
  preordersbar.map((preordersbar) => ({
    name: preordersbar.hour,
    total_orders: preordersbar.orders_per_hour,
  }));

  const productstree = (preproductstree) =>
  preproductstree.map((preproductstree) => ({
    name: preproductstree.department,
    number: preproductstree.number_of_products,
  }));

  const line = (preline) =>
  preline.map((preline) => ({
    name: preline.days,
    number_of_orders: preline.number,
  }));

useEffect(() => {
  getStats().then((data) => {
    if (data) {
      const { plots } = data;
      const { figure_1: MyBar,
              figure_2: MyTree,
              figure_3: MyLine} = plots;
        if (MyBar) {
          setorders(
            ordersbar(MyBar)
          )};
        if (MyTree) {
          setproducts(
            productstree(MyTree)
          )};
        if (MyLine) {
          setpast(
            line(MyLine)
          )};
    }
  });
}, []);
return(
  <div className="MyBar">
  <Title level={4}>number of orders per hour of day</Title>
  <ComposedChart
      width={1300}
      height={300}
      data={orders}
      margin={{top: 5, right: 30, left: 20, bottom: 5,}}
      barSize={30}
    >
      <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
      <YAxis /> 
      <CartesianGrid stroke="#f5f5f5" />
      <Bar dataKey="total_orders" fill="#8884d8" background={{ fill: '#eee' }} />
      <Line type="monotone" dataKey="total_orders" stroke="#ff7300" />
    </ComposedChart>
    <Title level={4}>Number of products per department</Title>
    <RadarChart cx={650} cy={300} outerRadius={250} width={5000} height={600} data={products}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis />
        <Radar dataKey="number" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
      <Title level={4}>Days until next order</Title>
      <AreaChart
        width={1300}
        height={300}
        data={past}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Area type="monotone" dataKey="number_of_orders" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </div>
);
};

export default StatsPage;