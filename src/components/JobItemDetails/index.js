import './index.css'
import {Component} from 'react'
import {IoStar, IoLocationSharp} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import {BsBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsOrg: {},
    skillsList: [],
    lifeAtCompanyDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  onSuccess = (jodDetails, similarJobs, skillsData, lifeAtCompany) => {
    const updatedDetails = {
      companyLogoUrl: jodDetails.company_logo_url,
      companyWebsiteUrl: jodDetails.company_website_url,
      employmentType: jodDetails.employment_type,
      id: jodDetails.id,
      jobDescription: jodDetails.job_description,
      location: jodDetails.location,
      packagePerAnnum: jodDetails.package_per_annum,
      rating: jodDetails.rating,
      title: jodDetails.title,
    }
    const updatedSkills = skillsData.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    }))
    const updateLifeAtCompany = {
      description: lifeAtCompany.description,
      imageUrl: lifeAtCompany.image_url,
    }
    const updatedSimilarJobsList = similarJobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    }))
    this.setState({
      jobDetailsOrg: updatedDetails,
      skillsList: updatedSkills,
      lifeAtCompanyDetails: updateLifeAtCompany,
      similarJobsList: updatedSimilarJobsList,
      apiStatus: apiStatusConstants.success,
    })
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(
        data.job_details,
        data.similar_jobs,
        data.job_details.skills,
        data.job_details.life_at_company,
      )
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSkills = () => {
    const {skillsList} = this.state

    return skillsList.map(each => {
      const {imageUrl, name} = each
      return (
        <li className="skills-list" key={each.name}>
          <img className="skills-img" src={imageUrl} />
          <p>{name}</p>
        </li>
      )
    })
  }

  renderLoaderView = () => (
    <div className="loader-jobs-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getRetry = () => {
    this.getJobDetails()
  }

  renderSuccessView = () => {
    const {jobDetailsOrg, lifeAtCompanyDetails, similarJobsList} = this.state
    const {description, imageUrl} = lifeAtCompanyDetails
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
    } = jobDetailsOrg
    return (
      <div className="jobitem-container">
        <div className="total-content">
          <div className="jobitem-content">
            <div className="logo-title-con-jobItem">
              <img
                className="job-company-logo-jobItem"
                src={companyLogoUrl}
                alt="job details company logo"
              />
              <div className="title-container-jobItem">
                <h1 className="job-title-jobItem">{title}</h1>
                <div className="rating-container-jobItem">
                  <IoStar className="star-style-jobItem" />
                  <p className="para-jobItem">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-salary-type-jobItem">
              <div className="location-salary-jobItem">
                <div className="location-style-jobItem">
                  <IoLocationSharp />
                  <p>{location}</p>
                </div>
                <div className="employ-style-jobItem">
                  <BsBriefcaseFill className="jobItem-employType-img" />
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr className="line-style-jobItem" />
            <div className="des-link">
              <h1 className="des-title">Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
            </div>
            <p>{jobDescription}</p>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list-container">{this.renderSkills()}</ul>
            <h1 className="life-at-heading">Life at Company</h1>
            <div className="des-img">
              <p className="des-para">{description}</p>
              <img className="life-des-img" src={imageUrl} />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobsList.map(each => (
              <SimilarJobs key={each.id} similarJobsDetails={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

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
    return (
      <>
        <Header />
        {this.renderFinalResult()}
      </>
    )
  }
}

export default JobItemDetails
