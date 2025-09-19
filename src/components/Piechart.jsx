import { Pie } from "react-chartjs-2";

export default function Piechart({
  expenses,
  setShowChart,
  showChart,
  showPieChart,
  setshowPieChart,
}) {
  // Group expenses by category
  const categories = [...new Set(expenses.map((e) => e.category))];
  const dataByCategory = categories.map((cat) =>
    expenses
      .filter((e) => e.category === cat && e.type === "Expense")
      .reduce((sum, e) => sum + parseInt(e.amount), 0)
  );

  const expenseType = expenses.filter((e) => e.type === "Expense");

  const data = {
    labels: categories,
    datasets: [
      {
        data: dataByCategory,
        backgroundColor: [
          "#6366F1", // indigo
          "#F59E0B", // amber
          "#10B981", // emerald
          "#EF4444", // red
          "#3B82F6", // blue
          "#8B5CF6", // violet
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="">
      <div className="py-5 md:py-0 bg-gray-900">
        <button
          className="absolute md:fixed text-2xl font-bold top-0 md:top-15 md:left-2 cursor-pointer p-4 hover:bg-gray-600 hover:opacity-60 rounded-full transition-all ease-in-out duration-300"
          onClick={() => {
            setshowPieChart(false);
            setShowChart(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="55px"
            viewBox="0 -960 960 960"
            width="55px"
            fill="#FFFFFF"
          >
            <path d="M655-80 255-480l400-400 56 57-343 343 343 343-56 57Z" />
          </svg>
        </button>
      </div>
      <div className="bg-gray-900 shadow-md p-10 min-h-[90vh] md:min-h-[94.9vh] flex flex-col items-center gap-18">
        <h2 className="text-xl md:text-3xl font-bold md:mb-4 text-center">
          Spending by Category
        </h2>
        {expenseType.length > 0 ? (
          <div className="h-75 w-75 md:h-150 md:w-150">
            <Pie data={data} options={{ maintainAspectRatio: false }} />
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
