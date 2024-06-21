import {Button, Item, Label, Segment} from "semantic-ui-react";
import { SyntheticEvent, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

function ActivityList() {
    const {activityStore} = useStore();
    const {activitiesByDate, selectActivity, deleteActivity, loading} = activityStore;
    const [target, setTarget] = useState('');

    function handleDeleteActivity(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id)
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button floated='right' content='View' color='blue' onClick={()=> selectActivity(activity.id)} />
                                <Button floated='right' content='Delete' color='red'
                                    name={activity.id}
                                    onClick={(e)=> handleDeleteActivity(e, activity.id)} 
                                    loading={loading && target === activity.id}/>
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList);