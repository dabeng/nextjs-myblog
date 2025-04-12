'use client'

import { useState, useEffect } from "react";
import classNames from 'classnames';


export { Pagination };
/* total代表条目总数
*  pageSize代表一页展示多少条目
*  visibleSize代表展示多少个页码数；设计思路是：没有条目时，只显示灰色不可用的首页、前一页、后一页、末页
*  不显示页码；条目大于0页，小于5页时，只显示够用的页码；大于5页时，只显示固定的5个页码
*/
function Pagination({ total, pageSize = 4, visibleSize = 5, onChange }) {
  const [currentPage, setCurrentPage] = useState(1);
  let lastPage = Math.ceil(total / pageSize);
  let isNextBtnDisabled = currentPage * pageSize >= total;
  let isPrevBtnDisabled = currentPage === 1;

  const gotoFirstPage = (e) => {
    setCurrentPage(1);
  };
  
  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const gotoPage = (e) => {
    setCurrentPage(parseInt(e.target.textContent));
  };

  const nextPage = (e) => {
    setCurrentPage(currentPage + 1);
  };

  const gotoLastPage = (e) => {
    setCurrentPage(lastPage);
  };

  // Wrapping onChange() with useEffect because states behaves like a snapshot.
  // Updating state requests another render with the new state value, but does not
  // affect the currentPage variable in your already-running event handler.
  useEffect(() => {
    // This code will run after every render
    onChange(currentPage);

    // You can perform other actions here, such as an API call
    // Example: makeApiCall(currentPage);
  }, [currentPage]); // The effect depends on the currentPage state

  return (
    <nav
      className="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className="button pagination-previous"
        onClick={gotoFirstPage}
      >
        First
      </button>
      <button
        className="button pagination-previous"
        onClick={!isPrevBtnDisabled ? previousPage : undefined}
        disabled={isPrevBtnDisabled}
      >
        Previous
      </button>
      <button
        className="button pagination-next"
        onClick={!isNextBtnDisabled ? nextPage : undefined}
        disabled={isNextBtnDisabled}
      >
        Next page
      </button>
      <button
        className="button pagination-next"
        onClick={gotoLastPage}
      >
        Last
      </button>
      <ul className="pagination-list">
        {
          Array(total >= visibleSize * pageSize ? visibleSize : lastPage)
            .fill(0)
            .map((v, index) => (
              <li key={index}>
                <a
                  className={classNames({
                    "pagination-link": true,
                    "is-current":
                    currentPage <= Math.ceil(visibleSize / 2)
                      ? currentPage === index + 1
                      : currentPage === lastPage - visibleSize + index + 1
                  })}
                  aria-label={"Goto page " + (index + 1)}
                  aria-current={index + 1 === currentPage ? "page" : undefined}
                  onClick={gotoPage}
                >
                  {currentPage <= Math.ceil(visibleSize / 2) && index + 1}
                  {currentPage > Math.ceil(visibleSize / 2) && lastPage - visibleSize + index + 1}
                </a>
              </li>
            ))
        }
      </ul>
    </nav>
  );
};