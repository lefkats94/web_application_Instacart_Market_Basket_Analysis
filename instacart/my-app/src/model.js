import React, {useState} from 'react';
import {Card, Form, InputNumber, Row, Button} from 'antd';
import axios from './Axios';
import ModelResults from './Results';

const ModelForm = () => {
    const [form] = Form.useForm();
    const [modelResults, setModelResults] = useState({
        prediction: []
    });
    const [resultsVisible, setResultsVisible] = useState(false);

    const getModelResults = (values) => {
        console.log(values)
        axios.post("model/", values)
            .then(value => {
                setModelResults(value.data);
                setResultsVisible(true)
            })
            .catch(reason => {
                console.error(reason)
            })
    };

    const onFormReset = () => {
        form.resetFields();
        setResultsVisible(false);
        setModelResults({
            prediction: []
        });
    }


return(
    <div>
        <Card>
            <Form form={form}
                    name="model"
                    onFinish={getModelResults}
                    scrollToFirstError>
                <Row>
                    <Form.Item
                        name="uxp_total_bought"
                        label="how many times has this customer order this product?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item
                        name="uxp_reorder_ratio"
                        label="how frequent does this customer order this product?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} max={1} step={0.01} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item
                        name="times_last5"
                        label="how many times did this customer buy this product in last 5 orders?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item
                        name="u_total_orders"
                        label="how many orders has each customer done?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item
                        name="u_reordered_ratio"
                        label="how frequent has this customer do a reorder?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} max={1} step={0.01} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item
                        name="p_total_purchases"
                        label="how many times has this product been reordered?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item
                        name="p_reorder_ratio"
                        label="how frequent has this product been reordered?"
                        rules={[{
                        required: true,
                        message: 'Please input!',
                        },]}>
                        <InputNumber min={0} max={1} step={0.01} />
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Get Prediciton
                        </Button>
                        <Button htmlType="button" onClick={onFormReset} style={{margin: '0 8px'}}>
                            Reset
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
        </Card>
        <ModelResults
                results={modelResults}
                resultsVisible={resultsVisible}
            />
    </div>
);
};

export default ModelForm;