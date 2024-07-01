import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  getUsername = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  getLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginInfo = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(loginInfo),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.getLogin}>
          <img
            className="logo-img"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <div className="input-container">
            <label htmlFor="username" className="label-style">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input-box"
              placeholder="Username"
              onChange={this.getUsername}
              value={username}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="label-style">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input-box"
              placeholder="Password"
              onChange={this.getPassword}
              value={password}
            />
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
