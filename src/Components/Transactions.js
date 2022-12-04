import { useState, useEffect } from 'react'
import Search from '../res/img/search.svg'
import Arrow from '../res/img/arrow.svg'
import PageArrow from '../res/img/pageArrow.svg'
import PageArrowDisabled from '../res/img/pageArrowDisabled.svg'
import { Table } from './Table'
import { useApi } from '../hooks/useApi'
import { ErrorPopUp } from './ErrorPopUp'

export const Transactions = () => {
  const { getTransactions, getTransactionsByFilter, error, setError } = useApi()
  const [transactions, setTransactions] = useState([])
  const [lastBlockNumber, setLastBlockNumber] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [params, setParams] = useState({
    open: false,
    values: [
      {
        name: 'Address',
        selected: true,
        value: 'address',
      },
      {
        name: 'ID',
        selected: false,
        value: 'hash',
      },
      {
        name: 'Block',
        selected: false,
        value: 'block',
      },
    ],
  })
  const [pages, setPages] = useState({
    current: 1,
    pagesNumber: 1,
  })

  const getData = async (currentPage) => {
    try {
      let data
      if (!inputValue) {
        data = await getTransactions({ page: currentPage })
      } else {
        const filter = params.values.find((val) => val.selected)
        const filterParams = {
          page: currentPage,
          filter: filter.value,
          value: inputValue,
        }
        data = await getTransactionsByFilter(filterParams)
      }
      if (!data) {
        return
      }
      setLastBlockNumber(data.lastBlockNumber)
      setTransactions(data.transactions)
      setPages({ current: currentPage, pagesNumber: data.pagesNumber })
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getData(pages.current)
  }, [])

  const paramHandler = (value) => {
    const copy = { ...params }
    const index = copy.values.findIndex((val) => val.value === value)
    copy.values.forEach((val) => (val.selected = false))
    copy.values[index].selected = true
    copy.open = false
    setParams(copy)
  }

  const isArrowActive = (direction) => {
    if (direction === -1) {
      return !(pages.current === 1)
    } else {
      return !(pages.current === pages.pagesNumber)
    }
  }

  const Pagination = () => {
    let addValue
    if (pages.pagesNumber <= 5) {
      addValue = 1
    } else {
      addValue = pages.pagesNumber - pages.current >= 5 ? pages.current : pages.pagesNumber - 4
    }

    return [...Array(pages.pagesNumber > 5 ? 5 : pages.pagesNumber).keys()].map((val, index) => {
      if (index + addValue === pages.current) {
        return (
          <div key={index + addValue} className='pageContainer active'>
            {index + addValue}
          </div>
        )
      }

      return (
        <div
          className='pageContainer'
          key={index + addValue}
          onClick={() => {
            getData(index + addValue)
          }}
        >
          {index + addValue}
        </div>
      )
    })
  }

  const arrowHandler = (direction) => {
    if (isArrowActive(direction)) {
      getData(pages.current + direction)
    }
  }

  return (
    <>
      {error && (
        <ErrorPopUp
          error={error}
          close={() => {
            setError(null)
          }}
        />
      )}
      <div className='container transactions'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            getData(1)
          }}
        >
          <div className='paramsContainer'>
            <input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
              }}
              placeholder='Search'
            />
            <div className='separator'></div>
            <div
              className='selector'
              onClick={() => {
                setParams({ ...params, open: !params.open })
              }}
            >
              <div className='selected'>{params.values.find((val) => val.selected).name}</div>
              <img src={Arrow} />
              {params.open && (
                <div className='list'>
                  {params.values.map((val) => {
                    return (
                      !val.selected && (
                        <div
                          className='item'
                          key={val.value}
                          onClick={() => {
                            paramHandler(val.value)
                          }}
                        >
                          {val.name}
                        </div>
                      )
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <button className='submit' type='submit'>
            <img src={Search} />
          </button>
        </form>
        <Table transactions={transactions} lastBlockNumber={lastBlockNumber} />
        <div className='pagination'>
          <div
            className={isArrowActive(-1) ? 'arrowContainer' : 'arrowContainer disabled'}
            onClick={() => {
              arrowHandler(-1)
            }}
          >
            <img className='prev' src={isArrowActive(-1) ? PageArrow : PageArrowDisabled} />
          </div>
          {Pagination()}
          <div
            className={isArrowActive(1) ? 'arrowContainer' : 'arrowContainer disabled'}
            onClick={() => {
              arrowHandler(1)
            }}
          >
            <img className='next' src={isArrowActive(1) ? PageArrow : PageArrowDisabled} />
          </div>
        </div>
      </div>
    </>
  )
}
