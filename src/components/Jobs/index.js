import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BiSearch} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Profile from '../Profile'
import JobCard from '../JobCard'
import Filter from '../Filter'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}
class Jobs extends Component {
  state = {
    employType: [],
    salary: '',
    search: '',
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getAllJobs()
  }

  onSuccess = jobsData => {
    const updatedList = jobsData.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))
    this.setState({
      jobsList: updatedList,
      apiStatus: apiStatusConstants.success,
    })
  }

  onFailure = () => {
    this.setState({apiStatus: apiStatusConstants.failure})
  }

  getAllJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {employType, salary, search} = this.state
    const convEmployType = employType.join(',')
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${convEmployType}&minimum_package=${salary}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.jobs)
    } else {
      this.onFailure()
    }
  }

  getSelectedEmployTypeOption = event => {
    const selectedEmployType = event.target.value
    const {employType} = this.state
    if (event.target.checked === true) {
      const updateSelectEt = [selectedEmployType, ...employType]
      this.setState({employType: updateSelectEt}, this.getAllJobs)
    } else {
      const updateSelectEt = employType.filter(
        each => each !== selectedEmployType,
      )
      this.setState({employType: updateSelectEt}, this.getAllJobs)
    }
  }

  getMinimumPackage = event => {
    this.setState({salary: event.target.value}, this.getAllJobs)
  }

  getInputSearch = event => {
    this.setState({search: event.target.value})
  }

  getSearchResults = () => {
    this.getAllJobs()
  }

  getRetry = () => {
    this.getAllJobs()
  }

  renderSuccessView = () => {
    const {jobsList} = this.state
    const showOrNot = jobsList.length > 0
    if (showOrNot) {
      return (
        <ul className="job-list-container">
          {jobsList.map(each => (
            <JobCard key={each.id} jobItemDetails={each} />
          ))}
        </ul>
      )
    }
    return (
      <div className="no-jobs-container">
        <img
          className="failure-view-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-jobs-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We can not seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.getRetry}
        className="failure-retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderFinalResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content-container">
            <div className="profile-filter-con">
              <div className="show-profile">
                <Profile />
              </div>
              <hr />
              <Filter
                salaryRangesList={salaryRangesList}
                employTypeList={employmentTypesList}
                getSelectedEmployTypeOption={this.getSelectedEmployTypeOption}
                getMinimumPackage={this.getMinimumPackage}
              />
            </div>
            <div className="show-jobs-con">
              <div className="search-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={search}
                  onChange={this.getInputSearch}
                />
                <button
                  onClick={this.getSearchResults}
                  data-testid="searchButton"
                  className="search-btn"
                >
                  <BiSearch className="search-icon" />
                </button>
              </div>
              {this.renderFinalResult()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
