import { Transactions } from './Components/Transactions'
import './styles.scss'

const App = () => {
  return (
    <div className='App'>
      <div className='header'>
        <div className='container'>AppCo</div>
      </div>
      <Transactions />
      <div className='footer'>
        <div className='container'>
          <h2 className='company'>AppCo</h2>
          <div className='rights'>All rights reserved by ThemeTags</div>
          <div>Copyrights © 2019.</div>
        </div>
      </div>
    </div>
  )
}

export default App
