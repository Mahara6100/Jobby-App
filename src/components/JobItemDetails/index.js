import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    isLoading: true,
    isFailed: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log('Fetching job details for ID:', id)

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log('Fetched job data:', data)

      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills,
        title: data.job_details.title,
      }

      const updatedSimilarJobs = data.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        isLoading: false,
      })
    } else {
      console.log('Failed to fetch job details')
      this.setState({isFailed: true, isLoading: false})
    }
  }

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
    } = jobDetails

    return (
      <div className="job-details-container">
        <div className="job-card job-details">
          <div className="job-card-header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-title-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <FaStar className="rating-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-card-details">
            <div className="job-location-type">
              <p className="job-location">
                <MdLocationOn className="job-icon" /> {location}
              </p>
              <p className="employment-type">
                <MdWork className="job-icon" /> {employmentType}
              </p>
            </div>
            <p className="job-package">{packagePerAnnum}</p>
          </div>

          <hr className="separator" />

          <div className="job-description-container">
            <h1 className="job-description-title">Description</h1>
            <a
              href={companyWebsiteUrl}
              className="visit-link"
              target="_blank"
              rel="noreferrer"
            >
              Visit <BsBoxArrowUpRight className="visit-icon" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>

          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills &&
              skills.map(skill => (
                <li key={skill.name} className="skill-item">
                  <img
                    src={skill.image_url}
                    alt={skill.name}
                    className="skill-img"
                  />
                  <p>{skill.name}</p>
                </li>
              ))}
          </ul>

          <h1 className="life-heading">Life at Company</h1>
          <div className="life-container">
            <p className="life-description">{lifeAtCompany?.description}</p>
            <img
              src={lifeAtCompany?.image_url}
              alt="life at company"
              className="life-img"
            />
          </div>
        </div>

        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(job => (
            <li key={job.id} className="similar-job-card">
              <div className="job-card-header">
                <img
                  src={job.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="job-title-container">
                  <h1 className="job-title">{job.title}</h1>
                  <div className="rating-container">
                    <FaStar className="rating-icon" />
                    <p className="rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="job-location-type">
                <p className="job-location">
                  <MdLocationOn className="job-icon" /> {job.location}
                </p>
                <p className="employment-type">
                  <MdWork className="job-icon" /> {job.employmentType}
                </p>
              </div>
              <h1 className="job-description-title">Description</h1>
              <p className="job-description">{job.jobDescription}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  render() {
    const {isLoading, isFailed} = this.state
    console.log('Render state:', this.state)

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (isFailed) {
      return this.renderFailureView()
    }

    return (
      <>
        <Header />
        <div className="job-item-details-page">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default withRouter(JobItemDetails)
