import { Line } from "react-chartjs-2";

export default function Linechart({
  expenses,
  setShowChart,
  showChart,
  showLineChart,
  setshowLineChart,
}) {
  // Filter only expenses (ignore income)
  const dailyExpenses = expenses.filter((e) => e.type === "Expense");

  // Group by date
  const grouped = dailyExpenses.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString("en-GB"); // e.g. 04/09/2025
    acc[date] = (acc[date] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});

  const labels = Object.keys(grouped); // Dates
  const dataPoints = Object.values(grouped); // Sums

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Spending",
        data: dataPoints,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3, // smooth curve
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      //   title: { display: true, text: "Daily Spending Trend" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const expenseType = expenses.filter((e)=> e.type === "Expense");

  return (
    <div className="">
      <div className="">
        <button
          className="absolute md:fixed text-2xl font-bold md:top-15 md:left-2 cursor-pointer p-4 hover:bg-gray-600 hover:opacity-60 rounded-full transition-all ease-in-out duration-300"
          onClick={() => {
            setshowLineChart(false);
            setShowChart(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="45px"
            viewBox="0 -960 960 960"
            width="45px"
            fill="#FFFFFF"
          >
            <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
          </svg>
        </button>
      </div>
      <div className="bg-gray-900 shadow-md p-10 min-h-[94.9vh] flex flex-col items-center gap-18">
        <h2 className="text-xl md:text-3xl font-bold text-center">
          Daily Spending Trend
        </h2>
        {expenseType.length > 0 ? (
          <div className="h-100 md:h-170 w-full">
            <Line data={data} options={options} />
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
