import './index.css'
import {IoStar, IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'

const SimilarJobs = props => {
  const {similarJobsDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsDetails

  return (
    <li className="Similar-Jobs-item-con">
      <div className="logo-title-con">
        <img
          className="job-company-logo-similarJob"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="title-container-similarJob">
          <h1 className="job-title-similarJob">{title}</h1>
          <div className="rating-container-similarJob">
            <IoStar className="star-style-similarJob" />
            <p className="para-similarJob">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similarJob-des">Description</h1>
      <p>{jobDescription}</p>
      <div className="job-location-type-con">
        <div className="location-style-similarJob">
          <IoLocationSharp />
          <p>{location}</p>
        </div>
        <div className="employ-style-similarJob">
          <BsBriefcaseFill className="similar-suitcase" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
