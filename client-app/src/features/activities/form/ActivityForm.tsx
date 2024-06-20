import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { ChangeEvent, useState } from "react";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrUpdate: (activity: Activity) => void;
}

export default function ActivityForm({activity: selectedActivity, closeForm, createOrUpdate}: Props) {
    const initialActivity = selectedActivity ?? {
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: '',
    }

    const [activity, setActivity] = useState(initialActivity);

    function handleOnSubmit() {
        createOrUpdate(activity);
    }

    function handleInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity(prvState => {
            return { 
                ...prvState,
                [name]: value
            }
        })
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleOnSubmit} autoComplete="off">
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInput}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInput}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInput}/>
                <Form.Input placeholder='Date' name='date' value={activity.date} onChange={handleInput}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInput}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInput}/>
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}