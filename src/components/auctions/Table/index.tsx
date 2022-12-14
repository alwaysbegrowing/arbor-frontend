import React, { ReactElement, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useGlobalFilter, useTable } from 'react-table'

import { ActionButton } from '../../auction/Claimer'
import { PageTitle } from '../../pureStyledComponents/PageTitle'

import Tooltip from '@/components/common/Tooltip'

const Wrapper = styled.div`
  margin-top: -30px;
`

const SectionTitle = styled(PageTitle)`
  font-weight: 400;
  font-size: 42px;
  color: #e0e0e0;
  margin: 0;
`

interface Props {
  data: any[]
  loading: boolean
  title: string
  columns: any[]
  emptyActionClass?: string
  emptyActionText?: string
  emptyDescription: string
  emptyActionClick?: () => void
  emptyLogo: ReactElement
  legendIcons: ReactElement
  name: string
}

const Table = ({
  columns,
  data,
  emptyActionClass,
  emptyActionClick,
  emptyActionText,
  emptyDescription,
  emptyLogo,
  legendIcons,
  loading,
  name,
  title,
  ...restProps
}: Props) => {
  const navigate = useNavigate()

  const globalFilter = React.useMemo(
    () => (rows, columns, filterValue) =>
      rows.filter((row) => row?.original?.search.toLowerCase().includes(filterValue.toLowerCase())),
    [],
  )

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data,
      globalFilter,
    },
    useGlobalFilter,
  )

  const sectionHead = useRef(null)

  return (
    <Wrapper ref={sectionHead} {...restProps}>
      <div className="mb-10 flex flex-wrap content-center items-end py-2 md:justify-between">
        <div className="flex flex-col space-y-4">
          <SectionTitle>{title}</SectionTitle>
          <div className="hidden flex-row items-center space-x-4 sm:flex">{legendIcons}</div>
        </div>
        <div className="my-12 sm:mt-5"></div>
      </div>

      <div
        className="min-h-[492px] overflow-auto overscroll-contain scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700"
        style={{
          maxHeight: !rows.length ? '100%' : 'calc(100vh - 391px)',
          height: !rows.length ? 'calc(100vh - 391px)' : 'inherit',
        }}
      >
        <table className="table h-full w-full" {...getTableProps()}>
          <thead className="sticky top-0 z-[1]">
            {headerGroups.map((headerGroup, i) => (
              <tr
                className="border-b border-b-[#D5D5D519]"
                key={i}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, i) => (
                  <th
                    className="bg-base-100 text-xs font-normal tracking-widest text-[#A3A3A3]"
                    key={i}
                    {...column.getHeaderProps()}
                  >
                    {column.tooltip ? (
                      <Tooltip left={column.Header} tip={column.tooltip} />
                    ) : (
                      column.render('Header')
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading &&
              [...Array(10).keys()].map((z) => (
                <tr className="h-[57px] bg-transparent text-sm text-[#D2D2D2]" key={z}>
                  {[...Array(columns.length).keys()].map((i) => (
                    <td className="bg-transparent text-center text-[#696969]" key={i}>
                      <div className="my-4 h-4 w-full max-w-sm animate-pulse rounded bg-gradient-to-r from-[#1F2123] to-[#181A1C]"></div>
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && !rows.length && (
              <tr className="h-[57px] bg-transparent text-sm text-[#D2D2D2]">
                <td
                  className="space-y-7 bg-transparent py-[100px] text-center text-[#696969]"
                  colSpan={columns.length}
                >
                  <div className="flex justify-center space-x-4 opacity-60">{emptyLogo}</div>
                  <div className="text-base text-[#696969]">{emptyDescription}</div>
                  {emptyActionText && (
                    <ActionButton
                      className={`!h-[41px] !w-[236px] ${emptyActionClass}`}
                      onClick={emptyActionClick}
                    >
                      {emptyActionText}
                    </ActionButton>
                  )}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row, i) => {
                prepareRow(row)
                return (
                  <tr
                    className="hover cursor-pointer bg-transparent text-2sm text-[#D2D2D2]"
                    key={i}
                    onClick={() => navigate(row.original.url)}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, i) => (
                      <td
                        className="max-w-xs overflow-hidden text-ellipsis bg-transparent"
                        key={i}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </Wrapper>
  )
}

export default Table
