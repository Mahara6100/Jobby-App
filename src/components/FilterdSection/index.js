import './index.css'

const FilterdSection = props => {
  const renderEmploymentTypes = () => {
    const {employmentTypesList, changeEmploymentType} = props

    return employmentTypesList.map(type => (
      <li key={type.employmentTypeId} className="filter-item">
        <input
          type="checkbox"
          id={type.employmentTypeId}
          value={type.employmentTypeId}
          onChange={changeEmploymentType}
        />
        <label htmlFor={type.employmentTypeId}>{type.label}</label>
      </li>
    ))
  }

  const renderSalaryRanges = () => {
    const {salaryRangesList, changeSalaryRange} = props

    return salaryRangesList.map(range => (
      <li key={range.salaryRangeId} className="filter-item">
        <input
          type="radio"
          id={range.salaryRangeId}
          name="salary"
          value={range.salaryRangeId}
          onChange={changeSalaryRange}
        />
        <label htmlFor={range.salaryRangeId}>{range.label}</label>
      </li>
    ))
  }

  return (
    <div className="filters-group-container">
      <hr className="hr-line" />
      <h1 className="filter-group-title">Type of Employment</h1>
      <ul className="filters-group-list">{renderEmploymentTypes()}</ul>
      <hr className="hr-line" />
      <h1 className="filter-group-title">Salary Range</h1>
      <ul className="filters-group-list">{renderSalaryRanges()}</ul>
    </div>
  )
}

export default FilterdSection
