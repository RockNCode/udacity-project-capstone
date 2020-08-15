import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getProfileInfo, patchProfile } from '../api/tracking-api'
import { ProfileItem } from '../types/ProfileItem'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTrackingProps {
  match: {
    params: {
      trackingId: string
    }
  }
  auth: Auth
}

interface EditTrackingState {
  userId: string,
  fullName: string
  file: any
  age: number
  targetSleepHours: number
  targetSleepMinutes: number
  targetMilk: number
  targetPee: number
  targetPoop: number
  imgSrc: string
  uploadState: UploadState
}

export class EditTracking extends React.PureComponent<
  EditTrackingProps,
  EditTrackingState
> {
  state: EditTrackingState = {
    userId: "",
    fullName: "",
    file: undefined,
    age: 0,
    targetSleepHours: 0,
    targetSleepMinutes: 0,
    targetMilk: 0,
    targetPee: 0,
    targetPoop: 0,
    imgSrc: '',
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //console.log("JSON FILE : " + event.target.files[0]);
    const files = event.target.files
    if (!files) return
    console.log("File name is : " + files[0].name)
    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    console.log("Handling update profile")

    event.preventDefault()

    try {
      if (this.state.file) {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.trackingId)
        console.log("Upload url is: " + uploadUrl)
        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, this.state.file)
      }
      const profileItem : any = {
        targetMilk: this.state.targetMilk,
        targetSleep: Math.floor(this.state.targetSleepHours / 60) + this.state.targetSleepMinutes,
        targetPoop: this.state.targetPoop,
        targetPee: this.state.targetPee,
        name: this.state.fullName,
        fileUrl: '',
        age: this.state.age
      }
      await patchProfile(this.props.auth.getIdToken(),profileItem)

    } catch (e) {
      alert('Error updating profile: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
      // Hack to force image reload no caching
      this.setState({imgSrc: "https://images-babytrack-dev.s3.amazonaws.com/" +this.state.userId + "?dummy=" + Math.floor(Math.random() * 200) })

    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  
  async componentDidMount() {
    console.log("Profile component mount")
    const oProfile = await getProfileInfo(this.props.auth.getIdToken())
    if(oProfile[0] == undefined)
      return;
    console.log("oProfileObject: " + JSON.stringify(oProfile[0]))
    this.setState({targetSleepHours: Math.floor(oProfile[0].targetsleep/60)})
    this.setState({targetSleepMinutes: oProfile[0].targetsleep % 60 })

    this.setState({targetMilk: oProfile[0].targetmilk})
    this.setState({targetPee: oProfile[0].targetpee})
    this.setState({targetPoop: oProfile[0].targetpoop})
    this.setState({fullName: oProfile[0].fullname})
    this.setState({userId: oProfile[0].userId})
    this.setState({imgSrc: "https://images-babytrack-dev.s3.amazonaws.com/" + oProfile[0].userId})

    this.setState({age: oProfile[0].age})
  }
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ fullName : event.target.value })
  }
  handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ age : parseInt(event.target.value) })
  }
  handleTargetMilkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ targetMilk : parseInt(event.target.value) })
  }
  handleTargetSleepChangeHours = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ targetSleepHours : parseInt(event.target.value) })
  }
  handleTargetSleepChangeMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ targetSleepMinutes : parseInt(event.target.value) })
  }
  handleTargetPeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ targetPee : parseInt(event.target.value) })
  }
  handleTargetPoopChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ targetPoop : parseInt(event.target.value) })
  }

  getVisibility = (isVisible) => {
    return isVisible ? 'inline' : 'none';
  }
  render() {
    return (
      <div>
        <h1>Profile</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field >
            <img src={this.state.imgSrc} width="200" height="200"/>
          </Form.Field>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Your Name' value={this.state.fullName}  onChange={(event:any)=>{this.setState({ fullName : event.target.value })}}/>
          </Form.Field>
          <Form.Field>
            <label>Age</label>
            <input placeholder='Age'  type="number" value={this.state.age}  onChange={ this.handleAgeChange }/>
          </Form.Field>
          <Form.Field>
            <label>Target sleep time per day</label>
            <input placeholder='Hours' type="number" value={this.state.targetSleepHours} onChange={ this.handleTargetSleepChangeHours } />
            <input placeholder='Minutes' type="number" value={this.state.targetSleepMinutes} onChange={ this.handleTargetSleepChangeMinutes }/>
          </Form.Field>
          <Form.Field>
            <label>Target milk per day</label>
            <input placeholder='Amount in ML' type="number" value={this.state.targetMilk} onChange={ this.handleTargetMilkChange } />
          </Form.Field>
          <Form.Field>
            <label>Target pee diaper per day</label>
            <input placeholder='Number of diapers' type="number" value={this.state.targetPee} onChange={ this.handleTargetPeeChange } />
          </Form.Field>
          <Form.Field>
            <label>Target poop diaper per day</label>
            <input placeholder='Number of diapers' type="number" value={this.state.targetPoop} onChange={ this.handleTargetPoopChange }/>
          </Form.Field>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
              
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
