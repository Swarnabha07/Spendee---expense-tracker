import { Bar } from "react-chartjs-2";
import dayjs from "dayjs"; // for date formatting

export default function Barchart({
  expenses,
  setShowChart,
  showChart,
  showBarChart,
  setshowBarChart,
}) {
  // Extract unique months from expense dates
  const months = [
    ...new Set(expenses.map((e) => dayjs(e.date).format("MMM YYYY"))),
  ];
  const dataByMonth = months.map((m) =>
    expenses
      .filter(
        (e) => dayjs(e.date).format("MMM YYYY") === m && e.type === "Expense"
      )
      .reduce((sum, e) => sum + parseInt(e.amount), 0)
  );

  const data = {
    labels: months,
    datasets: [
      {
        label: "Expenses",
        data: dataByMonth,
        backgroundColor: "#D1D5DB", // indigo
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      //   title: { display: true, text: "Monthly Spending Trend" },
    },
  };

  const expenseType = expenses.filter((e)=> e.type === "Expense");

  return (
    <div className=" bg-gray-900">
      <button
        className="relative md:fixed font-bold md:top-15 md:left-2 cursor-pointer p-4 hover:bg-gray-600 hover:opacity-60 rounded-full transition-all ease-in-out duration-300"
        onClick={() => {
          setshowBarChart(false);
          setShowChart(false);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#FFFFFF"
          className="w-8 h-8 md:w-14 md:h-14"
        >
          <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
        </svg>
      </button>
      <div className="bg-gray-900 shadow-md p-10 min-h-[94.9vh] flex flex-col items-center gap-18">
        <h2 className="text-xl md:text-3xl font-bold text-center">
          Monthly Spending Trend
        </h2>
        {expenseType.length > 0 ? (
          <div className="h-120 md:h-170 w-full">
            <Bar data={data} options={options} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4 my-50">
            <span className="text-2xl md:text-4xl  text-gray-300 animate-pulse w-full mx-auto text-center">
              No data available
            </span>
            <span className="text-xl md:text-2xl text-gray-300 animate-pulse w-full mx-auto text-center">
              Your chart will appear here once you add expenses
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
