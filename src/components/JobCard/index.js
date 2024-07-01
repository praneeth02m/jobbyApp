import './index.css'
import {IoStar, IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

const JobCard = props => {
  const {jobItemDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItemDetails

  return (
    <Link to={`/jobs/${id}`} className="link-jobitem-style">
      <li className="list-container">
        <div className="logo-title-con">
          <img
            className="job-company-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="title-container">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <IoStar className="star-style" />
              <p className="para">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-salary-type">
          <div className="location-salary">
            <div className="location-style">
              <IoLocationSharp />
              <p>{location}</p>
            </div>
            <div className="employ-style">
              <BsBriefcaseFill className="suitcase-style" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="line-style" />
        <h1 className="description-title">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
