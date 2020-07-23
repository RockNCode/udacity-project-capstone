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
  Dropdown,
  Form,
  Accordion,
  FormField
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
  newComment: string
  loadingTracking: boolean,
  date : Date,
  activeIndex: number,
  selectedType: string,
  selectedHour: string,
  selectedMinute: string,
  errorStr: string
} 

export class Tracking extends React.PureComponent<TrackingProps, TrackingState> {
  state: TrackingState = {
    tracking: [],
    newComment: '',
    loadingTracking: true,
    date: new Date(),
    activeIndex: 0,
    selectedType: 'none',
    selectedHour: '',
    selectedMinute: '',
    errorStr: ''
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleSubmit = (event,data) => {
    console.log("Handling submit comment = "
      + this.state.newComment
      + " date = " + this.state.date)

    let hour: number = parseInt(this.state.selectedHour)
    let minute: number = parseInt(this.state.selectedMinute)
    if(this.state.selectedType == 'Nap'){
      if(hour <= 0 || hour >= 24){
        this.state.errorStr+= 'Invalid hours input.\n'
      }
      if(hour <= 0 || hour >= 24){
        this.state.errorStr+= 'Invalid hours input.\n'
      }
    }

    if(this.state.errorStr != '') {
      let err = this.state.errorStr
      alert(err);
      this.state.errorStr='';
      return;
    }

    console.log("passed validation")
  }

  onChanged = (date : Date) => this.setState({ date })


  onEditButtonClick = (trackingId: string) => {
    this.props.history.push(`/tracking/${trackingId}/edit`)
  }

  onTrackingCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTracking = await createTracking(this.props.auth.getIdToken(), {
        type: this.state.selectedType,
        comments: this.state.newComment
      })
      this.setState({
        tracking: [...this.state.tracking, newTracking],
        newComment: ''
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
  handleTypeChange = (event,data) => {
    console.log("selected value is " + data.value)
    this.setState({ selectedType: data.value })
  }
  handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newComment: event.target.value })
  }

  handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("hour = " + event.target.value)
    this.setState({ newComment: event.target.value })
  }
  handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("minute = " + event.target.value)
    this.setState({selectedMinute : event.target.value})
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
    const options = [
      { key: '1', value: 'Nap', text: 'Nap' },
      { key: '2', value: 'Formula', text: 'Formula' },
      { key: '3', value: 'Breastfeed', text: 'Breastfeed' },
      { key: '4', value: 'Pee diaper', text: 'Pee diaper change' },
      { key: '5', value: 'Poop diaper', text: 'Poop diaper change' },
      { key: '6', value: 'Medication', text: 'Medication' },

    ]
    const { activeIndex } = this.state
    
    const HideableDuration = (props) => {
      if(props.isVisible == true){
        return <FormField>
          <label>Duration</label>
          <input type="text" placeholder='Hours'  onChange={this.handleHourChange} />
          <input type="text" placeholder='Minutes' onChange = {this.handleMinuteChange}/>
        </FormField>
      }
      return null;
    }
    
    return (
      <Accordion styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          New item
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Segment.Group>
            <Segment color='red' textAlign='center'>
              <DateTimePicker
                onChange={this.onChanged}
                value={this.state.date}
              />
            </Segment>
            
            <Segment color= 'blue' >
              <Form>
              <Form.Select
                  fluid
                  label='Type'
                  options={options}
                  placeholder='Type'
                  onChange={this.handleTypeChange}
                />
                
                {/* <HideableDuration isVisible={this.state.selectedType == "Nap"}>                
                </HideableDuration> */}
                
                <FormField >
                  <label>Duration</label>
                  <input type="number" min='0' max='24' placeholder='Hours'  onChange={this.handleHourChange} />
                  <input type="number" min='0' max='60' placeholder='Minutes' onChange = {this.handleMinuteChange}/>
                </FormField>
                <Form.Field>
                  <label>Comments</label>
                  <input placeholder='Comments' onChange={this.handleCommentChange}/>
                </Form.Field>
                <Button type='submit' onClick={this.handleSubmit}>Submit</Button>

              </Form>
            </Segment>
            
          </Segment.Group>

        </Accordion.Content>
        </Accordion>
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
