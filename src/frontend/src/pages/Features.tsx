import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "react-bootstrap";
import { addFeature, getFeature } from "../backendRequests/FeaturesRequests";
import { errorSlice, useAppDispatch } from "../store/Store";
import FeatureSelect from "../components/FeatureSelect/FeatureSelect";

export default function Features() {
    const dispatch = useAppDispatch();
    const [data, setData] = useState("");
    const [fileName, setFileName] = useState("");
    const [isSaving, setSaving] = useState(false);
    const [isChanged, setChanged] = useState(false);

    useEffect(() => {
        if (isSaving) {
            addFeature({fileName, data}).then(() => {
                setChanged(false);
                setSaving(false);
            });
        }
    }, [isSaving]);

    const onFeatureClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        getFeature(event.target.value)
            .then((value) => {
                setFileName(value.fileName);
                setData(value.data);
            })
            .catch((error) => dispatch(errorSlice.actions.addError(error)));
    }

    const handleSaveClick = () => setSaving(true);
    
    const handleCancelClick = () => {
        getFeature(fileName)
            .then((value) => {
                setFileName(value.fileName);
                setData(value.data);
                setChanged(false);
            })
            .catch((error) => dispatch(errorSlice.actions.addError(error)));
    }

    return (
        <>
            <FeatureSelect onChange={(event) => onFeatureClick(event)}/>
            <Editor
                height="40vh"
                language="gherkin"
                theme="vs-dark"
                value={data}
                onChange={(value) => {
                    setChanged(true);
                    setData(value ?? "")
                }}
            />
            <Button
                variant="primary"
                disabled={isSaving || !isChanged}
                onClick={!isSaving ? handleSaveClick : undefined}
            >
                {isSaving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="secondary" onClick={handleCancelClick}>Cancel</Button>
        </>
    );
}