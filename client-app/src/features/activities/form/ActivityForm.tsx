import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import {v4 as uuid} from 'uuid';
import LoadingComponent from "../../../app/layout/LoadingComponent";

function ActivityForm() {
    const {activityStore} = useStore();
    const {loadingInitial, loading, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: '',
    });

    useEffect(() => {
        if (id) {
            loadActivity(id).then(activity => setActivity(activity!));
        }
    }, [id, loadActivity]);

    function handleSubmit() {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
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

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInput}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInput}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInput}/>
                <Form.Input type='date' placeholder='Date' name='date' value={activity.date} onChange={handleInput}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInput}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInput}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);