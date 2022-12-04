import ReactDOM from 'react-dom'

export const ErrorPopUp = ({ error, close }) => {
  const Error = (
    <div className='errorBlur'>
      <div className='content'>
        <h1>Error</h1>
        <p>{error}</p>
        <div onClick={close}>OK</div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(Error, document.getElementById('error'))
}
