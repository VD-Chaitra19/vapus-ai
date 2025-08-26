"use client";
import React, { useMemo, useState, useEffect } from "react";
import Table from "../components/table";
import PaginationLarge from "../../components/PaginationLarge";

const LargeDataset = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate a bigger dataset (e.g., 50k rows)
  const data = useMemo(
    () =>
      Array.from({ length: 50000 }, (_, i) => ({
        customer_id: `LCUST${1001 + i}`,
        customer_name: `Large Customer ${i + 1}`,
        phone_number: `555-020-${(1001 + i).toString().padStart(4, "0")}`,
        address: `#${(i % 999) + 1} Some St, City ${(i % 97) + 1}, ST ${(i % 50) + 1} ${(10000 + i)}`,
      })),
    []
  );

  const filteredData = useMemo(
    () =>
      searchTerm
        ? data.filter((item) =>
            Object.values(item).some((v) =>
              String(v).toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        : data,
    [data, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(start, start + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const columns = [
    { Header: "CUSTOMER ID", accessor: "customer_id" },
    { Header: "CUSTOMER NAME", accessor: "customer_name" },
    { Header: "PHONE NUMBER", accessor: "phone_number" },
    { Header: "ADDRESS", accessor: "address" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Large Dataset</h2>

      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center gap-2">
          <span>entries per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              setItemsPerPage(n);
              setCurrentPage(1);
            }}
            className="p-2 border rounded"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded w-[260px]"
        />
      </div>

      <Table
        columns={columns}
        data={currentItems}
        searching={false}
        lengthChange={false}
        searchTerm={searchTerm}
      />

      <div className="mt-4 flex justify-between items-center">
        <PaginationLarge
          totalPages={totalPages}
          currentPage={currentPage}
          onChange={setCurrentPage}
        />
        <div className="text-sm text-gray-600">
          Showing {start + 1}–{Math.min(start + itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
      </div>
    </div>
  );
};

export default LargeDataset;
