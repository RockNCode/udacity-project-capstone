import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
//import * as DateTimePicker from 'react-datetime-picker';
import DateTimePicker from "react-datetime-picker";

import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Container,
  Segment,
  Dropdown
} from 'semantic-ui-react'

import { createTracking, deleteTracking, getTracking, patchTracking } from '../api/tracking-api'
import Auth from '../auth/Auth'
import { TrackingItem } from '../types/Tracking'

interface TrackingProps {
  auth: Auth
  history: History
}

interface TrackingState {
  tracking: TrackingItem[]
  newTrackingName: string
  loadingTracking: boolean,
  date : Date
} 

export class Tracking extends React.PureComponent<TrackingProps, TrackingState> {
  state: TrackingState = {
    tracking: [],
    newTrackingName: '',
    loadingTracking: true,
    date: new Date()
  }


  onChanged = (date : Date) => this.setState({ date })

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTrackingName: event.target.value })
  }

  onEditButtonClick = (trackingId: string) => {
    this.props.history.push(`/tracking/${trackingId}/edit`)
  }

  onTrackingCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTracking = await createTracking(this.props.auth.getIdToken(), {
        name: this.state.newTrackingName,
        dueDate
      })
      this.setState({
        tracking: [...this.state.tracking, newTracking],
        newTrackingName: ''
      })
    } catch {
      alert('Item creation failed')
    }
  }

  onTrackingDelete = async (trackingId: string) => {
    try {
      await deleteTracking(this.props.auth.getIdToken(), trackingId)
      this.setState({
        tracking: this.state.tracking.filter(tracking => tracking.trackingId != trackingId)
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  // onTrackingCheck = async (pos: number) => {
  //   try {
  //     const tracking = this.state.tracking[pos]
  //     await patchTracking(this.props.auth.getIdToken(), tracking.trackingId, {
  //       timeStart: tracking.timeStart,
  //       duration: tracking.duration,
  //       comments: tracking.comments
  //     })
  //     this.setState({
  //       tracking: update(this.state.tracking, {
  //         [pos]: { done: { $set: !tracking.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Tracking deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const tracking = await getTracking(this.props.auth.getIdToken())
      this.setState({
        tracking,
        loadingTracking: false
      })
    } catch (e) {
      alert(`Failed to fetch tracking: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Baby Tracker</Header>
        <div>
      </div>
        {this.renderCreateTrackingInput()}

        {this.renderTracking()}
      </div>
    )
  }

  // renderCreateTrackingInput() {
  //   return (
  //     <Grid.Row>
  //       <Grid.Column width={16}>
  //         <Input
  //           action={{
  //             color: 'teal',
  //             labelPosition: 'left',
  //             icon: 'add',
  //             content: 'New tracking item',
  //             onClick: this.onTrackingCreate
  //           }}
  //           fluid
  //           actionPosition="left"
  //           placeholder="nap time"
  //           onChange={this.handleNameChange}
  //         />
  //       </Grid.Column>
  //       <Grid.Column width={16}>
  //         <Divider />
  //       </Grid.Column>
  //     </Grid.Row>
  //   )
  // }

  renderCreateTrackingInput() {
    return (
      <Container text>
      <Segment.Group>
        <Segment>
          <DateTimePicker
            onChange={this.onChanged}
            value={this.state.date}
          />
        </Segment>
        <Segment>
        <Dropdown
          options={[
            { key: 'type', value: 'Nap', text: 'Nap' },
            { key: 'type', value: 'Formula', text: 'Formula' },
            { key: 'type', value: 'Breastfeed', text: 'Breastfeed' },
                        
          ]}
          placeholder='Select'
          selection
        />
        </Segment>
        <Segment>Content</Segment>
        <Segment>Content</Segment>
      </Segment.Group>
    </Container>
    )

  }
  renderTracking() {
    if (this.state.loadingTracking) {
      return this.renderLoading()
    }

    return this.renderTrackingList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading tracking items
        </Loader>
      </Grid.Row>
    )
  }

  renderTrackingList() {
    return (
      <Grid padded>
        {this.state.tracking.map((tracking, pos) => {
          return (
            <Grid.Row key={tracking.trackingId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTrackingCheck(pos)}
                  checked={tracking.done}
                />
              </Grid.Column> */}
              <Grid.Column width={2} verticalAlign="middle">
                {tracking.date}
              </Grid.Column>
              <Grid.Column width={2} floated="right" verticalAlign="middle">
                {tracking.type}
              </Grid.Column>
              <Grid.Column width={2} floated="right" verticalAlign="middle">
                {tracking.timeStart}
              </Grid.Column>
              <Grid.Column width={2} floated="right" verticalAlign="middle">
                {tracking.duration}
              </Grid.Column>
              <Grid.Column width={4} floated="right" verticalAlign="middle">
                {tracking.comments}
              </Grid.Column>
              <Grid.Column width={1} floated="right" >
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(tracking.trackingId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTrackingDelete(tracking.trackingId)}
                >
                  <Icon name="delete" />
                </Button>
              {/* </Grid.Column>
              {tracking.attachmentUrl && (
                <Image src={tracking.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}> */}
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
