import { useState } from "react";
import Piechart from "./Piechart";
import Barchart from "./Barchart";
import Linechart from "./Linechart";
import { Line } from "react-chartjs-2";

export default function Sidebar({
  isOpen,
  setIsOpen,
  showChart,
  setShowChart,
  transactionArray,
}) {
  const [showPieChart, setshowPieChart] = useState(false);
  const [showBarChart, setshowBarChart] = useState(false);
  const [showLineChart, setshowLineChart] = useState(false);
  return (
    <div className="relative">
      {/* Overlay (blackish transparent background) */}
      {isOpen && ( 
        <div
          className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-78 md:w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Insights</h2>
          {/* Close button inside sidebar */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="p-4 space-y-4">
          <li
            onClick={() => {
              setIsOpen(false);
              setShowChart(true);
              setshowPieChart(true);
            }}
            className="hover:text-gray-400 cursor-pointer flex gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M520-520h278q-15-110-91.5-186.5T520-798v278Zm-80 358v-636q-121 15-200.5 105.5T160-480q0 122 79.5 212.5T440-162Zm80 0q110-14 187-91t91-187H520v278Zm-40-318Zm0 400q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z" />
            </svg>
            <span>Spending by Category</span>
          </li>
          <li
            onClick={() => {
              setIsOpen(false);
              setShowChart(true);
              setshowLineChart(true);
            }}
            className="hover:text-gray-400 cursor-pointer flex gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="m296-320 122-122 80 80 142-141v63h80v-200H520v80h63l-85 85-80-80-178 179 56 56Zm-96 200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
            <span>Daily Spending Trend</span>
          </li>
          <li
            onClick={() => {
              setIsOpen(false);
              setShowChart(true);
              setshowBarChart(true);
            }}
            className="hover:text-gray-400 cursor-pointer flex gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z" />
            </svg>
            <span>Monthly Spending Trend</span>
          </li>
        </ul>
      </div>
      {showPieChart && (
        <div>
          <Piechart
            expenses={transactionArray}
            setShowChart={setShowChart}
            showChart={showChart}
            showPieChart={showPieChart}
            setshowPieChart={setshowPieChart}
          />
        </div>
      )}
      {showBarChart && (
        <div>
          <Barchart
            expenses={transactionArray}
            setShowChart={setShowChart}
            showChart={showChart}
            showBarChart={showBarChart}
            setshowBarChart={setshowBarChart}
          />
        </div>
      )}
      {showLineChart && (
        <div>
          <Linechart
            expenses={transactionArray}
            setShowChart={setShowChart}
            showChart={showChart}
            showLineChart={showLineChart}
            setshowLineChart={setshowLineChart}
          />
        </div>
      )}
    </div>
  );
}
