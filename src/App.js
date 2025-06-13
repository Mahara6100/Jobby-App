import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './components/Home'
import Jobs from './components/Jobs'
// import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />

    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
