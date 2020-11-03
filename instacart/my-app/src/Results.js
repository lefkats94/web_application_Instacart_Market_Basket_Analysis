import React from 'react';
import {Card, Typography} from "antd";

const ModelResults = (props) => {
    const {
        resultsVisible,
        results: {
            prediction
        }
    } = props;
    return (
        resultsVisible && (
            <Card title="Model Results">
                <Typography>Prediction Results</Typography>
                <Typography.Text mark>{prediction}</Typography.Text>
            </Card>
        )
    )
};

export default ModelResults;