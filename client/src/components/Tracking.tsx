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
  FormField,
  Message,
  Table,
  Menu,
  Label
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
  selectedHour: number,
  selectedMinute: number,
  selectedAmount: number,
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
    selectedHour: 0,
    selectedMinute: 0,
    selectedAmount: 0,
    errorStr: ''
  }

  clearFormState = () => {
    this.setState({newComment: ''})
    this.setState({selectedHour: 0})
    this.setState({selectedMinute: 0})
    this.setState({selectedAmount: 0})
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleSubmit = async (event,data) => {
    console.log("Handling submit comment = "
      + this.state.newComment
      + " date = " + this.state.date)

    // let hour: number = parseInt(this.state.selectedHour)
    // let minute: number = parseInt(this.state.selectedMinute)
    // if(this.state.selectedType == 'Nap'){
    //   if(hour <= 0 || hour >= 24){
    //     this.state.errorStr+= 'Invalid hours input.\n'
    //   }
    //   if(hour <= 0 || hour >= 24){
    //     this.state.errorStr+= 'Invalid hours input.\n'
    //   }
    // }

    if(this.state.errorStr != '') {
      let err = this.state.errorStr
      alert(err);
      this.state.errorStr='';
      return;
    }

    console.log("passed validation")

    try {
      const mDate = this.state.date.toISOString();
      const mDuration = this.state.selectedHour * 60 + this.state.selectedMinute;
      const newTracking = await createTracking(this.props.auth.getIdToken(), {
        date: mDate,
        type: this.state.selectedType,
        duration: mDuration,
        amount: this.state.selectedAmount,
        comments: this.state.newComment
      })
      this.setState({
        tracking: [...this.state.tracking, newTracking],
        newComment: ''
      })
    } catch(e) {
      alert('Item creation failed: ' + e)
    }
    this.clearFormState();
  }

  onChanged = (date : Date) => this.setState({ date })


  onEditButtonClick = (trackingId: string) => {
    this.props.history.push(`/tracking/${trackingId}/edit`)
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
    this.clearFormState();
  }
  handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newComment: event.target.value })
  }

  handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("hour = " + event.target.value)
    let hour = parseInt(event.target.value);
    if(hour >= 0 || hour <= 24)
      this.setState({ selectedHour : hour })
    
    if(hour > 24){
      this.setState({ selectedHour : 24 })
      event.target.value = '24'
    }
    else if(hour<=0){
      this.setState({ selectedHour : 0 })
      event.target.value = '0'
    }
    
  }
  handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("minute = " + event.target.value)
    let min = parseInt(event.target.value);
    if(min >= 0 || min <= 59)
      this.setState({ selectedMinute : min })
    if(min > 59){
      this.setState({ selectedMinute : 59 })
      event.target.value = '59'
    }
    else if(min<=0){
      this.setState({ selectedMinute : 0 })
      event.target.value = '0'
    }
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("amount = " + event.target.value)
    let amount = parseInt(event.target.value);
    if(amount >= 0 || amount <= 1000)
      this.setState({ selectedAmount : amount })
    if(amount >= 1000){
      this.setState({ selectedAmount : 1000 })
      event.target.value = '1000'
    }
    else if(amount<=0){
      this.setState({ selectedAmount : 0 })
      event.target.value = '0'
    }
  }

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
        {this.renderFilter()}
        {this.renderTracking()}
        {this.renderCreateTrackingInput()}
      </div>
    )
  }

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
              <Form error>
              <Form.Select
                  fluid
                  label='Type'
                  options={options}
                  placeholder='Type'
                  onChange={this.handleTypeChange}
                />
                
                <FormField style={{display: this.getVisibility(this.state.selectedType == 'Nap')}} >
                  <label>Duration</label>
                  <input type="number" min='0' max='24'  placeholder='Hours'  value = {this.state.selectedHour}
                  onChange={ this.handleHourChange }  />
                  <input type="number" min='0' max='59'  placeholder='Minutes' value = {this.state.selectedMinute}
                  onChange = {this.handleMinuteChange} /> 
                </FormField>
                <FormField style={{display: this.getVisibility(this.state.selectedType == 'Formula' 
                                                              || this.state.selectedType == 'Breastfeed')}} >
                  <label>Amount (ML)</label>
                  <input type="number" min='0' max='1000'  placeholder='120'  value = {this.state.selectedAmount}
                  onChange={ this.handleAmountChange }  />
 
                </FormField>
                
                <Form.Field>
                  <label>Comments</label>
                  <input placeholder='Comments' onChange={this.handleCommentChange} value = {this.state.newComment}/>
                </Form.Field>
                <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
                <Message style={{display: 'none'}}
                  error
                  header='Input validation error'
                  content={this.state.errorStr}
                />
              </Form>
            </Segment>
            
          </Segment.Group>

        </Accordion.Content>
        </Accordion>
    )

  }
  getVisibility = (isVisible) => {
    return isVisible ? 'inline' : 'none'; 
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
  renderFilter() {
    const optionsTypeFilter = [
      { key: '1', value: 'Nap', text: 'Nap' },
      { key: '2', value: 'Formula', text: 'Formula' },
      { key: '3', value: 'Breastfeed', text: 'Breastfeed' },
      { key: '4', value: 'Pee diaper', text: 'Pee diaper change' },
      { key: '5', value: 'Poop diaper', text: 'Poop diaper change' },
      { key: '6', value: 'Medication', text: 'Medication' },
    ]
    return (
      <Form.Select
                  fluid
                  label='Type'
                  options={optionsTypeFilter}
                  placeholder='Type'
                  onChange={this.handleTypeChange}
                />
    )
  }

  renderTrackingList() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Duration</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Comments</Table.HeaderCell>
            <Table.HeaderCell>Edit / Delete</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>

        {
          this.state.tracking.map((tracking, pos) => {
            return(
              <Table.Row>
                <Table.Cell>{tracking.date}</Table.Cell>
                <Table.Cell>{tracking.type}</Table.Cell>
            <Table.Cell>{
              Math.floor(tracking.duration / 60) } hours {tracking.duration % 60} minutes</Table.Cell>
                <Table.Cell>{tracking.amount} ML</Table.Cell>
                <Table.Cell>{tracking.comments}</Table.Cell>
                <Table.Cell>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(tracking.trackingId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onTrackingDelete(tracking.trackingId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>

              </Table.Row>)
          })
        }
        </Table.Body>
        <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='3'>
            <Menu floated='right' pagination>
              <Menu.Item as='a' icon>
                <Icon name='chevron left' />
              </Menu.Item>
              <Menu.Item as='a'>1</Menu.Item>
              <Menu.Item as='a'>2</Menu.Item>
              <Menu.Item as='a'>3</Menu.Item>
              <Menu.Item as='a'>4</Menu.Item>
              <Menu.Item as='a' icon>
                <Icon name='chevron right' />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
