import { useEffect, useState } from 'react'
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    })
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectedActivity();
    setIsEditMode(true);
  }

  function handleFormClose() {
    setIsEditMode(false);
  }

  function handleCreateOrUpdateActivity(activity: Activity) {
    activity.id 
      ? setActivities(prvState => [...prvState.filter(x => x.id !== activity.id), activity]) 
      : setActivities(prvState => [...prvState, { ...activity, id: uuid() }]);
    setIsEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities(prvState => [...prvState.filter(x => x.id !== id)]);
    if(selectedActivity && selectedActivity.id === id) {
      setSelectedActivity(undefined);
    }
  }

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectedActivity={handleCancelSelectedActivity}
          isEditMode={isEditMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrUpdate={handleCreateOrUpdateActivity}
          deleteActivity={handleDeleteActivity} />
      </Container>
    </>
  )
}

export default App
