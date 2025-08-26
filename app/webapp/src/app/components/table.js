"use client";

import React, { useState, useEffect, useRef } from "react";
import LoadingOverlay from "./loading/loading";

const DataTable = ({
  id,
  data = [],
  columns = [],
  // controlled pagination from parent
  currentPage = 1,
  itemsPerPage = 10,

  // other knobs
  ordering = true,
  select = true,
  responsive = true,
  loading = false,
  loadingText = "Loading data...",
  className = "",
  filteredColumns = [],
  searchTerm,

  // 👇 custom content to render under the table (e.g., Pagination)
  bottomSlot = null,
}) => {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);
  const [scriptsReady, setScriptsReady] = useState(false);

  useEffect(() => {
    const checkLoaded = () =>
      window.jQuery && window.jQuery.fn && window.jQuery.fn.DataTable;

    const loadScripts = async () => {
      if (checkLoaded()) { setScriptsReady(true); return; }

      if (!document.querySelector('link[href*="dataTables.dataTables.min.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.datatables.net/2.2.2/css/dataTables.dataTables.min.css";
        document.head.appendChild(link);
      }

      if (!window.jQuery) {
        const jq = document.createElement("script");
        jq.src = "https://code.jquery.com/jquery-3.7.1.min.js";
        jq.async = true;
        document.body.appendChild(jq);
        await new Promise((r) => (jq.onload = r));
      }

      if (!window.jQuery?.fn?.DataTable) {
        const dt = document.createElement("script");
        dt.src = "https://cdn.datatables.net/2.2.2/js/dataTables.min.js";
        dt.async = true;
        document.body.appendChild(dt);
        await new Promise((r) => (dt.onload = r));
      }

      let tries = 0;
      while (!checkLoaded() && tries < 10) {
        await new Promise((r) => setTimeout(r, 200));
        tries++;
      }
      if (checkLoaded()) setScriptsReady(true);
      else console.error("Failed to load DataTables");
    };

    loadScripts();

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, []);

  // header filter styles
  useEffect(() => {
    if (!scriptsReady) return;
    const style = document.createElement("style");
    style.textContent = `
      .dt-header-filter{position:relative;cursor:pointer;}
      .dt-header-filter:after{content:'▼';font-size:10px;margin-left:5px;opacity:.6;}
      .dt-filter-dropdown{position:absolute;top:100%;left:0;z-index:1000;display:none;
        min-width:160px;max-height:200px;overflow-y:auto;background:#333;border:1px solid #444;
        border-radius:4px;box-shadow:0 4px 8px rgba(0,0,0,.3);}
      .dt-filter-dropdown.show{display:block;}
      .dt-filter-option{padding:6px 12px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .dt-filter-option:hover{background:#444;}
      .dt-filter-option.active{background:#555;}
      .dt-filter-option.all{border-bottom:1px solid #444;font-weight:bold;}
      .dt-filter-dropdown::-webkit-scrollbar{width:6px;height:8px;}
      .dt-filter-dropdown::-webkit-scrollbar-track{border-radius:10vh;background:oklch(0.37 0.013 285.805);}
      .dt-filter-dropdown::-webkit-scrollbar-thumb{background:#dd290a;border-radius:10vh;}
      .dt-filter-dropdown::-webkit-scrollbar-thumb:hover{background:#dd290a;}
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [scriptsReady]);

  // (re)initialize DT
  useEffect(() => {
    if (!scriptsReady || !tableRef.current || loading) return;

    const $ = window.jQuery;

    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    const dtColumns = columns.map((col) => {
      const cfg = { title: col.Header, data: col.accessor };
      if (searchTerm && col.accessor) {
        cfg.render = function (val, type) {
          if (type === "display" && val) {
            const text = String(val);
            const i = text.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (i !== -1 && searchTerm.length) {
              return (
                text.slice(0, i) +
                `<span class="bg-yellow-300">${text.slice(i, i + searchTerm.length)}</span>` +
                text.slice(i + searchTerm.length)
              );
            }
          }
          return val;
        };
      }
      return cfg;
    });

    dataTableRef.current = $(tableRef.current).DataTable({
      data,
      columns: dtColumns,

      // Use internal paging for correct info; hide default pager UI.
      paging: true,
      info: true,
      lengthChange: false,
      dom: "ti", // table + info only

      ordering,
      select,
      responsive,
      destroy: true,

      initComplete: function () {
        const api = this.api();

        // header filters (optional)
        api.columns().every(function (idx) {
          const column = this;
          const colInfo = dtColumns[idx];
          const name = colInfo.title || `Column ${idx + 1}`;
          const key =
            typeof colInfo.data === "string"
              ? colInfo.data
              : colInfo.name || name;

          const headerCell = $(column.header());
          const shouldFilter =
            filteredColumns.includes(key) ||
            filteredColumns.includes(idx) ||
            filteredColumns.includes(name);

          if (shouldFilter) {
            headerCell.html(`<div class="dt-header-filter">${name}</div>`);
            const dd = $('<div class="dt-filter-dropdown"></div>');
            dd.append('<div class="dt-filter-option all" data-value="">All</div>');

            const uniq = new Set();
            column.data().each((v) => {
              if (v !== null && v !== undefined && String(v).trim() !== "") {
                uniq.add(String(v));
              }
            });
            Array.from(uniq)
              .sort()
              .forEach((v) =>
                dd.append(`<div class="dt-filter-option" data-value="${v}">${v}</div>`)
              );

            headerCell.append(dd);
            headerCell.find(".dt-header-filter").on("click", (e) => {
              e.stopPropagation();
              $(".dt-filter-dropdown").not(dd).removeClass("show");
              dd.toggleClass("show");
            });

            dd.on("click", ".dt-filter-option", function () {
              dd.find(".dt-filter-option").removeClass("active");
              $(this).addClass("active");
              const value = $(this).data("value");
              const val = $.fn.dataTable.util.escapeRegex(value);
              column.search(val ? `^${val}$` : "", true, false).draw();
              dd.removeClass("show");
            });
          } else {
            headerCell.html(name);
          }
        });

        $(document).on("click.dt-filter", () =>
          $(".dt-filter-dropdown").removeClass("show")
        );

        // initial page + page size
        api.page.len(itemsPerPage).draw(false);
        api.page(Math.max(0, currentPage - 1)).draw("page");
      },
    });

    return () => {
      if (window.jQuery) {
        window.jQuery(document).off("click.dt-filter");
      }
    };
  }, [scriptsReady, loading, data, columns, searchTerm, ordering, select, responsive, filteredColumns]);

  // keep DT in sync when parent changes page/size
  useEffect(() => {
    if (!dataTableRef.current) return;
    const api = dataTableRef.current;
    api.page.len(itemsPerPage).draw(false);
    api.page(Math.max(0, currentPage - 1)).draw("page");
  }, [itemsPerPage, currentPage]);

  // when data changes, ensure current page is valid
  useEffect(() => {
    if (!dataTableRef.current) return;
    const api = dataTableRef.current;
    const pages = api.page.info().pages || 1;
    const safePage = Math.min(Math.max(1, currentPage), pages);
    if (safePage !== currentPage) {
      api.page(safePage - 1).draw("page");
    }
  }, [data, currentPage]);

  return (
    <div className="datatable-container relative">
      <LoadingOverlay
        isLoading={loading}
        text={loadingText}
        size="default"
        showProgressBar={true}
        isOverlay={true}
        className="rounded-lg mt-80"
      />

      <div className="overflow-x-auto scrollbar rounded-lg shadow-md">
        <table
          ref={tableRef}
          id={id}
          className={`min-w-full divide-y divide-zinc-500 text-gray-100 border-2 border-zinc-500 text-xs ${className}`}
        >
          <thead className="bg-zinc-900 text-sm text-gray-500 uppercase tracking-wider" />
          <tbody className="bg-zinc-800 divide-y divide-zinc-500 break-words" />
        </table>
      </div>

      {/* 👇 Your custom pagination INSIDE the DataTable wrapper */}
      {bottomSlot ? <div className="mt-6">{bottomSlot}</div> : null}
    </div>
  );
};

export default DataTable;
