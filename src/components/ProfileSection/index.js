import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

class ProfileSection extends Component {
  state = {
    profile: null,
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.fetchProfile()
  }

  fetchProfile = async () => {
    this.setState({isLoading: true, isError: false})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          profile: data.profile_details,
          isLoading: false,
        })
      } else {
        this.setState({isError: true, isLoading: false})
      }
    } catch (error) {
      this.setState({isError: true, isLoading: false})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderErrorView = () => (
    <div className="profile-container">
      <button type="button" className="retry-btn" onClick={this.fetchProfile}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profile} = this.state
    return (
      <div className="profile-container">
        <img
          src={profile.profile_image_url}
          alt="profile"
          className="profile-img"
        />
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-bio">{profile.short_bio}</p>
      </div>
    )
  }

  render() {
    const {isLoading, isError} = this.state

    if (isLoading) {
      return this.renderLoadingView()
    }

    if (isError) {
      return this.renderErrorView()
    }

    return this.renderProfileView()
  }
}

export default ProfileSection
