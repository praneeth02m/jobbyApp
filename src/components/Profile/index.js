import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

const apiStatusOfProfile = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Profile extends Component {
  state = {profileDetails: {}, apiStatus: apiStatusOfProfile.initial}

  componentDidMount() {
    this.getProfileDetails()
  }

  onSuccess = profileInfo => {
    const updatedData = {
      name: profileInfo.name,
      profileImageUrl: profileInfo.profile_image_url,
      shortBio: profileInfo.short_bio,
    }
    this.setState({
      profileDetails: updatedData,
      apiStatus: apiStatusOfProfile.success,
    })
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusOfProfile.inProgress})
    const authToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.profile_details)
    } else {
      this.setState({apiStatus: apiStatusOfProfile.failure})
    }
  }

  retryProcess = () => {
    this.getProfileDetails()
  }

  renderLoaderView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="retry-container">
      <button className="retry-btn" type="button" onClick={this.retryProcess}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img className="profile-pic-img" src={profileImageUrl} alt="profile" />
        <p className="profile-name">{name}</p>
        <p className="bio-text">{shortBio}</p>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusOfProfile.inProgress:
        return this.renderLoaderView()
      case apiStatusOfProfile.success:
        return this.renderSuccessView()
      case apiStatusOfProfile.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default Profile
