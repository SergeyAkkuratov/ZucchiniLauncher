import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { updateFeatures, useAppSelector } from "../../store/Store";

export interface FeatureSelectProps {
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    id?: string;
}

export default function FeatureSelect(props: FeatureSelectProps) {
    const features = useAppSelector((state) => state.Features.filenames);

    useEffect(() => {
        updateFeatures();
    }, []);

    return (
        <>
            <Form.Label htmlFor="fileName">Feature file name</Form.Label>
            <Form.Select data-testid={`select-feature`} aria-label="Feature select" onChange={props.onChange} value={props.value} id={props.id}>
                <option selected disabled value="placeholder" data-testid="select-placeholder">
                    Choose feature...
                </option>
                {features.map((name, index) => (
                    <option key={index} value={name} data-testid={`select-feature-option-${index}`}>
                        {name}
                    </option>
                ))}
            </Form.Select>
        </>
    );
}
