import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button, ButtonGroup, Dropdown, Stack } from "react-bootstrap";
import { addFeature, getFeature, removeFeature } from "../backendRequests/FeaturesRequests";
import { updateFeatures, useAppDispatch, useAppSelector } from "../store/Store";
import errorSlice from "../store/ErrorSlice";
import FeatureSelect from "../components/FeatureSelect/FeatureSelect";
import AddNewFeature from "../components/AddNewFeature/AddNewFeature";
import ConfirmWindow from "../components/ConfirmWindow/ConfirmWindow";
import userSlice from "../store/UserSlice";

export default function Features() {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector(userSlice.selectors.isAdmin);
    const [data, setData] = useState("");
    const [fileName, setFileName] = useState("");
    const [isSaving, setSaving] = useState(false);
    const [isChanged, setChanged] = useState(false);
    const [showAddFeature, setShowAddFeature] = useState(false);
    const [isModalShow, setIsModalShow] = useState(false);

    async function addNewFeature(newFileName: string, confirm?: boolean) {
        if (fileName && confirm) {
            try {
                await addFeature({ fileName: newFileName, data });
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(errorSlice.actions.addError({
                        name: "Couldn't add feature",
                        message: `${error.message}`
                    }));
                }
            }
        }
        updateFeatures();
        setShowAddFeature(false);
    }

    useEffect(() => {
        if (isSaving) {
            addFeature({ fileName, data }).then(() => {
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

    async function closeModal(confirm: boolean) {
        setIsModalShow(false);
        if (confirm && fileName && fileName!=="") {
            try {
                await removeFeature(fileName);
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(errorSlice.actions.addError({
                        name: "Couldn't remove feature",
                        message: `${error.message}`
                    }));
                }

            }
            updateFeatures();
        }
    }

    return (
        <>
            <FeatureSelect onChange={(event) => onFeatureClick(event)} />
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
            <Stack direction="horizontal" gap={3}>
                <Dropdown as={ButtonGroup} className="ms-auto">
                    <Button
                        variant="success"
                        disabled={isSaving || !isChanged}
                        onClick={!isSaving ? handleSaveClick : undefined}
                    >
                        {isSaving ? 'Saving…' : 'Save changes'}
                    </Button>

                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShowAddFeature(true)}>Add new feature</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="danger" onClick={() => setIsModalShow(true)} disabled={!isAdmin}>Delete</Button>
                <Button variant="secondary" onClick={handleCancelClick}>Cancel</Button>
            </Stack>
            <ConfirmWindow title="Remove feature" message="Do you really want to remove feature from server?" showModal={isModalShow} closeModal={closeModal} />
            <AddNewFeature showModal={showAddFeature} closeModal={addNewFeature} />
        </>
    );
}