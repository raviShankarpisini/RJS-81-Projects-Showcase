import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const statusConstants = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  failure: 'failure',
}

class App extends Component {
  state = {
    selectedCategory: categoriesList[0].id,
    dataList: [],
    status: statusConstants.initial,
  }

  componentDidMount() {
    this.getFetchData()
  }

  getFetchData = async () => {
    const {selectedCategory} = this.state
    this.setState({status: statusConstants.loading})
    const url = await `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({dataList: updatedData, status: statusConstants.success})
    } else {
      this.setState({status: statusConstants.failure})
    }
  }

  onClickRetry = () => this.getFetchData()

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {dataList} = this.state
    return (
      <ul>
        {dataList.map(each => (
          <li key={each.id}>
            <img src={each.imageUrl} alt={each.name} />
            <p>{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  loadingView = () => (
    <div testid="loader">
      <Loader />
    </div>
  )

  renderSwitch = () => {
    const {status} = this.state

    switch (status) {
      case statusConstants.failure:
        return this.failureView()
      case statusConstants.success:
        return this.successView()
      case statusConstants.loading:
        return this.loadingView()

      default:
        return null
    }
  }

  onChangeSelect = event =>
    this.setState({selectedCategory: event.target.value}, this.getFetchData)

  render() {
    const {selectedCategory} = this.state
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="filter">
          <select onChange={this.onChangeSelect} value={selectedCategory}>
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderSwitch()}
      </div>
    )
  }
}

export default App
