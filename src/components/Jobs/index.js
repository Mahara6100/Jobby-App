import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileSection from '../ProfileSection'
import FilterdSection from '../FilterdSection'
import JobsCard from '../JobsCard'

import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstant.initial,
    activeEmploymentTypeIds: [],
    activeSalaryRangeId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeEmploymentTypeIds,
      activeSalaryRangeId,
      searchInput,
    } = this.state

    const employmentTypesQuery = activeEmploymentTypeIds.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesQuery}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchData = await response.json()
      const updatedData = fetchData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <JobsCard jobDetails={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs"
        />
        <h1 className="no-job-heading">No Jobs Found</h1>
        <p className="no-job-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderJobsListView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeEmploymentType = employmentTypeId => {
    this.setState(prevState => {
      const {activeEmploymentTypeIds} = prevState
      const isAlreadySelected = activeEmploymentTypeIds.includes(
        employmentTypeId,
      )

      const updatedTypes = isAlreadySelected
        ? activeEmploymentTypeIds.filter(id => id !== employmentTypeId)
        : [...activeEmploymentTypeIds, employmentTypeId]

      return {activeEmploymentTypeIds: updatedTypes}
    }, this.getJobs)
  }

  changeSalaryRange = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobs)
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.enterSearchInput()
    }
  }

  onChangeSearchInput = event => {
    this.changeSearchInput(event.target.value)
  }

  onClickSearch = () => {
    this.getJobs()
  }

  renderSearchInput = () => {
    const {searchInput} = this.state

    return (
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
          className="search-input"
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onClickSearch}
          className="search-btn"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {activeEmploymentTypeIds, activeSalaryRangeId} = this.state

    return (
      <>
        <Header />
        <div className="section-container">
          <div className="profile-filter-section">
            <ProfileSection />
            <FilterdSection
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              activeEmploymentTypeIds={activeEmploymentTypeIds}
              activeSalaryRangeId={activeSalaryRangeId}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
            />
          </div>
          <div className="jobs-section">
            {this.renderSearchInput()}
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
