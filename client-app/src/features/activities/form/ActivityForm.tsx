import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

function ActivityForm() {
    const {activityStore} = useStore();
    const {selectedActivity, loading, createActivity, updateActivity, closeForm} = activityStore;
    
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
        activity.id ? updateActivity(activity) : createActivity(activity);
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
                <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInput}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInput}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInput}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);