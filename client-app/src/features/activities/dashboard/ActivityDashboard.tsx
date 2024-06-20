import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectedActivity: () => void;
    isEditMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrUpdate: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

export default function ActivityDashboard({activities, selectedActivity, selectActivity, cancelSelectedActivity, 
    isEditMode, openForm, closeForm, createOrUpdate, deleteActivity}: Props) {
    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity}/>
            </Grid.Column>
            <Grid.Column width="6">
                {selectedActivity && !isEditMode &&
                    <ActivityDetails 
                        activity={selectedActivity} 
                        cancelSelectedActivity={cancelSelectedActivity}
                        openForm={openForm} />}
                {isEditMode && <ActivityForm 
                                    activity={selectedActivity} 
                                    closeForm={closeForm} 
                                    createOrUpdate={createOrUpdate}/>}
            </Grid.Column>
        </Grid>
    )
}