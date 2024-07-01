import './index.css'

const Filter = props => {
  const {employTypeList, salaryRangesList} = props
  const renderEmployTypeOption = () =>
    employTypeList.map(each => {
      const {label, employmentTypeId} = each
      const {getSelectedEmployTypeOption} = props
      return (
        <li key={employmentTypeId} className="employment-type-option">
          <input
            className="filter-input"
            id={employmentTypeId}
            value={employmentTypeId}
            onChange={getSelectedEmployTypeOption}
            type="checkbox"
          />
          <label className="label-filter" htmlFor={employmentTypeId}>
            {label}
          </label>
        </li>
      )
    })

  const renderSalaryRange = () =>
    salaryRangesList.map(each => {
      const {salaryRangeId, label} = each
      const {getMinimumPackage} = props
      return (
        <li key={salaryRangeId} className="employment-type-option">
          <input
            className="filter-input"
            type="radio"
            name="salary"
            onChange={getMinimumPackage}
            value={salaryRangeId}
            id={salaryRangeId}
          />
          <label className="label-filter" htmlFor={salaryRangeId}>
            {label}
          </label>
        </li>
      )
    })
  return (
    <div>
      <p className="filter-title">Type of Employment</p>
      <ul className="filter-list-style">{renderEmployTypeOption()}</ul>
      <hr />
      <h1 className="filter-title">Salary Range</h1>
      <ul className="filter-list-style">{renderSalaryRange()}</ul>
    </div>
  )
}

export default Filter
