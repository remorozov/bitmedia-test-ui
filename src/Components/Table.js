export const Table = ({ transactions, lastBlockNumber }) => {
  const getDate = (date) => {
    date = new Date(date)
    date = date.toDateString()
    date = date.split(' ')
    date.shift()
    date = date.join('-')
    return date
  }

  const Transaction = transactions.map((tran, index) => {
    return (
      <tr key={index}>
        <td>{tran.block}</td>
        <td>
          <span>
            <a target='_blank' href={`https://etherscan.io/tx/${tran.hash}`}>
              {tran.hash}
            </a>
          </span>
        </td>
        <td>{tran.from}</td>
        <td>{tran.to}</td>
        <td>{lastBlockNumber - tran.block}</td>
        <td>{getDate(tran.date)}</td>
        <td>{tran.value}</td>
        <td>{tran.gas}</td>
      </tr>
    )
  })

  return (
    <div className='tableContainer'>
      <table>
        <thead>
          <tr>
            <th>Block number</th>
            <th>Transaction ID</th>
            <th>Sender address</th>
            <th>Recipient's address</th>
            <th>Block confirmations</th>
            <th>Date</th>
            <th>Value</th>
            <th>Transaction Fee</th>
          </tr>
        </thead>
        <tbody>{Transaction}</tbody>
      </table>
    </div>
  )
}
