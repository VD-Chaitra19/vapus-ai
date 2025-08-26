"use client";

import React, { useMemo, useState, useEffect } from "react";
import Table from "../components/table";
import Pagination from "../../components/Pagination";

const SmallDataset = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const generateRandomAddress = () => {
    const streets = ["Main St", "Oak Ave", "Pine Ln", "Maple Dr", "Elm St"];
    const cities = ["Anytown", "Someville", "Othercity", "Metropolis", "Gotham"];
    const states = ["CA", "NY", "TX", "FL", "IL"];
    const zipCodes = ["10001", "90210", "75001", "33101", "60601"];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `${Math.floor(Math.random() * 999) + 1} ${rand(streets)}, ${rand(cities)}, ${rand(states)} ${rand(zipCodes)}`;
  };

  const rawData = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        customer_id: `CUST${1001 + i}`,
        customer_name: `Customer Name ${i + 1}`,
        phone_number: `555-010-${1001 + i}`,
        address: generateRandomAddress(),
      })),
    []
  );

  const filteredData = useMemo(
    () =>
      rawData.filter((item) =>
        Object.values(item).some((v) =>
          String(v).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [rawData, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const columns = [
    { Header: "CUSTOMER ID", accessor: "customer_id" },
    { Header: "CUSTOMER NAME", accessor: "customer_name" },
    { Header: "PHONE NUMBER", accessor: "phone_number" },
    { Header: "ADDRESS", accessor: "address" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Small Dataset</h1>

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
              <option key={n} value={n}>{n}</option>
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
          className="p-2 border rounded w-[250px]"
        />
      </div>

      <Table
        id="small-dt"
        columns={columns}
        data={filteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        ordering={true}
        select={true}
        responsive={true}
        searchTerm={searchTerm}
        bottomSlot={
          totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          )
        }
      />
    </div>
  );
};

export default SmallDataset;
