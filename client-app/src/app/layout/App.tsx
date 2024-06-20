import { useEffect, useState } from 'react'
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
        })
        setActivities(activities);
        setLoading(false);
      })
  }, [])

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
    setSubmitting(true);
    if (activity.id) {
        agent.Activities.update(activity).then(() => {
            setActivities([...activities.filter(x => x.id !== activity.id), activity]);
            setSelectedActivity(activity);
            setIsEditMode(false);
            setSubmitting(false);
        })
    } else {
        activity.id = uuid();
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, activity]);
            setSelectedActivity(activity);
            setIsEditMode(false);
            setSubmitting(false);
        })
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false);

      if(selectedActivity && selectedActivity.id === id) {
        setSelectedActivity(undefined);
      }
    })
  }

  if (loading) {
    return <LoadingComponent content='Loading app...' />
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
          deleteActivity={handleDeleteActivity}
          submitting={submitting} />
      </Container>
    </>
  )
}

export default App
