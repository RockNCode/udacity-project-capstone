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

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { TrackingItem } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: TrackingItem[]
  newTodoName: string
  loadingTodos: boolean,
  date : Date
} 

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    date: new Date()
  }


  onChanged = (date : Date) => this.setState({ date })

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Item creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.trackingId != todoId)
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  // onTodoCheck = async (pos: number) => {
  //   try {
  //     const todo = this.state.todos[pos]
  //     await patchTodo(this.props.auth.getIdToken(), todo.trackingId, {
  //       timeStart: todo.timeStart,
  //       duration: todo.duration,
  //       comments: todo.comments
  //     })
  //     this.setState({
  //       todos: update(this.state.todos, {
  //         [pos]: { done: { $set: !todo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Todo deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Baby Tracker</Header>
        <div>
      </div>
        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  // renderCreateTodoInput() {
  //   return (
  //     <Grid.Row>
  //       <Grid.Column width={16}>
  //         <Input
  //           action={{
  //             color: 'teal',
  //             labelPosition: 'left',
  //             icon: 'add',
  //             content: 'New tracking item',
  //             onClick: this.onTodoCreate
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

  renderCreateTodoInput() {
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
  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
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

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.trackingId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column> */}
              <Grid.Column width={2} verticalAlign="middle">
                {todo.date}
              </Grid.Column>
              <Grid.Column width={2} floated="right" verticalAlign="middle">
                {todo.type}
              </Grid.Column>
              <Grid.Column width={2} floated="right" verticalAlign="middle">
                {todo.timeStart}
              </Grid.Column>
              <Grid.Column width={2} floated="right" verticalAlign="middle">
                {todo.duration}
              </Grid.Column>
              <Grid.Column width={4} floated="right" verticalAlign="middle">
                {todo.comments}
              </Grid.Column>
              <Grid.Column width={1} floated="right" >
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.trackingId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.trackingId)}
                >
                  <Icon name="delete" />
                </Button>
              {/* </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
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
