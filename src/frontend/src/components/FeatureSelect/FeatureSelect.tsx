import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getFeatures } from "../../backendRequests/FeaturesRequests";
import { errorSlice, useAppDispatch } from "../../store/Store";


export interface FeatureSelectProps {
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    id?: string;
}

export default function FeatureSelect(props: FeatureSelectProps) {
    const dispatch = useAppDispatch();
    const [features, setFeatures] = useState<string[]>([]);
    
    useEffect(() => {
        getFeatures()
            .then((names) => { setFeatures(names) })
            .catch((error) => { dispatch(errorSlice.actions.addError(error)) });
    }, [])

    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if(props.onChange) props.onChange(event);
    }

    return (
        <>
            <Form.Label htmlFor="fileName">Feature file name</Form.Label>
            <Form.Select aria-label="Feature select" onChange={(event) => handleOnChange(event)} value={props.value} id={props.id}>
                <option selected disabled value="placeholder">Choose feature...</option>
                {features.map((name, index) => <option key={index} value={name}>{name}</option>)}
            </Form.Select>
        </>
    )
}