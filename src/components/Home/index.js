import './index.css'

import {Link} from 'react-router-dom'
import Header from '../Header'

const Home = props => {
  const {history} = props

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content-container">
          <div className="home-content">
            <h1 className="home-title">Find The Job That Fits Your Life</h1>
            <p className="home-description">
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential
            </p>
            <Link to="/jobs">
              <button className="find-jobs-btn" type="button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
