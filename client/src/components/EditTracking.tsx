import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getProfileInfo } from '../api/tracking-api'

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
  fullName: string
  file: any
  age: number
  targetSleep: number
  targetMilk: number
  targetPee: number
  targetPoop: number
  uploadState: UploadState
}

export class EditTracking extends React.PureComponent<
  EditTrackingProps,
  EditTrackingState
> {
  state: EditTrackingState = {
    fullName: "",
    file: undefined,
    age: 0,
    targetSleep: 0,
    targetMilk: 0,
    targetPee: 0,
    targetPoop: 0,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.trackingId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
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
    console.log("oProfileObject: " + JSON.stringify(oProfile[0]))
    this.setState({targetSleep: oProfile[0].targetsleep})
    this.setState({targetMilk: oProfile[0].targetmilk})
    this.setState({targetPee: oProfile[0].targetpee})
    this.setState({targetPoop: oProfile[0].targetpoop})
    this.setState({fullName: oProfile[0].fullname})
    this.setState({file: oProfile[0].fileurl})

    this.setState({age: oProfile[0].age})
  }

  render() {
    return (
      <div>
        <h1>Profile</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Your Name' value={this.state.fullName} />
          </Form.Field>
          <Form.Field>
            <label>Age</label>
            <input placeholder='Age' value={this.state.age}/>
          </Form.Field>
          <Form.Field>
            <label>Target sleep time per day</label>
            <input placeholder='Hours' value={Math.floor(this.state.targetSleep / 60) + ' hours'}/>
            <input placeholder='Minutes' value={this.state.targetSleep % 60 + ' minutes'}/>
          </Form.Field>
          <Form.Field>
            <label>Target milk per day</label>
            <input placeholder='Amount in ML' value={this.state.targetMilk}/>
          </Form.Field>
          <Form.Field>
            <label>Target pee diaper per day</label>
            <input placeholder='Number of diapers' value={this.state.targetPee} />
          </Form.Field>
          <Form.Field>
            <label>Target poop diaper per day</label>
            <input placeholder='Number of diapers' value={this.state.targetPoop} />
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
