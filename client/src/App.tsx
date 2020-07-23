import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Container,Button } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTracking } from './components/EditTracking'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Tracking } from './components/Tracking'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    const { children } = this.props
    //const { fixed } = this.state

    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      // <Menu>
      //   <Menu.Item name="home">
      //     <Link to="/">Home</Link>
      //   </Menu.Item>

      //   <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      // </Menu>
      <Menu
              //fixed={fixed ? 'top' : null}
              // inverted={!fixed}
              // pointing={!fixed}
              // secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item as='a' active>
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item as='a'>Profile</Menu.Item>
                <Menu.Item position='right'>
                  {this.logInLogOutButton()}
                </Menu.Item>
              </Container>
            </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Tracking {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/tracking/:trackingId/edit"
          exact
          render={props => {
            return <EditTracking {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
