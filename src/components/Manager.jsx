import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  ArcElement,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
const Manager = () => {
  const [plus, setPlus] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([
    "Personal",
    "Social",
    "Household",
    "Travel",
    "Finance",
    "Entertainment",
    "Learning",
    "Health",
    "Work",
    "Shopping",
    "Food",
  ]);
  const [types, setTypes] = useState(["Income", "Expense"]);
  const [isOpen, setIsOpen] = useState(false);
  const [transactionArray, setTransactionArray] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "",
    date: "",
  });

  useEffect(() => {
    let newTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (newTransactions) setTransactionArray(newTransactions);

    let newTotalIncome = JSON.parse(localStorage.getItem("totalIncome"));
    if (newTotalIncome !== null) setTotalIncome(newTotalIncome);

    let newTotalexpense = JSON.parse(localStorage.getItem("totalExpense"));
    if (newTotalexpense !== null) setTotalExpense(newTotalexpense);
  }, []);

  const handleAdd = () => {
    if (
      form.title.length === 0 ||
      form.amount.length === 0 ||
      form.date.length === 0
    ) {
      toast.error("You can't leave the form blank", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (isNaN(Number(form.amount))) {
      toast.error("Amount should be a number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      if (editingId) {
        //CASE 1: Editing existing transaction

        const updatedTransactions = [
          ...transactionArray,
          { ...form, id: editingId },
        ];

        setTransactionArray(updatedTransactions);
        localStorage.setItem(
          "transactions",
          JSON.stringify(updatedTransactions)
        );

        const income = updatedTransactions
          .filter((t) => t.type === "Income")
          .reduce((sum, t) => sum + parseInt(t.amount), 0);
        const expense = updatedTransactions
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + parseInt(t.amount), 0);

        setTotalIncome(income);
        setTotalExpense(expense);
        localStorage.setItem("totalIncome", JSON.stringify(income));
        localStorage.setItem("totalExpense", JSON.stringify(expense));
      } else {
        //CASE 2: Adding new transaction

        if (form.type == "Income") {
          setTotalIncome(parseInt(totalIncome) + parseInt(form.amount));
          localStorage.setItem(
            "totalIncome",
            JSON.stringify(parseInt(totalIncome) + parseInt(form.amount))
          );
        } else {
          setTotalExpense(parseInt(totalExpense) + parseInt(form.amount));
          localStorage.setItem(
            "totalExpense",
            JSON.stringify(parseInt(totalExpense) + parseInt(form.amount))
          );
        }
        const newTransactions = { ...form, id: uuidv4() };
        setTransactionArray([...transactionArray, newTransactions]);
        localStorage.setItem(
          "transactions",
          JSON.stringify([...transactionArray, newTransactions])
        );
      }

      // reset everything after add/edit
      setForm({
        title: "",
        amount: "",
        date: "",
        category: "",
        type: "",
      });
      setPlus(false);
      setEditingId(null);
      setShowDelete(false);
    }
  };

  const handleBack = () => {
    let newTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (newTransactions) setTransactionArray(newTransactions);
    setForm({
      title: "",
      amount: "",
      date: "",
      category: "",
      type: "",
    });
    setShowDelete(false);
    setPlus(false);
  };

  const handleEdit = (id) => {
    const transactionToEdit = transactionArray.filter((item) => {
      return item.id === id;
    })[0];
    setForm(transactionToEdit);
    setTransactionArray(
      transactionArray.filter((item) => {
        return item.id !== id;
      })
    );
    setEditingId(id);
    setPlus(true);
    setShowDelete(true);
  };

  const handleDelete = (id) => {
    let conf = confirm(
      "Do you really want to delete this transaction from your history?"
    );
    if (conf) {
      setTransactionArray(
        transactionArray.filter((item) => {
          return item.id !== id;
        })
      );
      localStorage.setItem(
        "transactions",
        JSON.stringify(
          transactionArray.filter((item) => {
            return item.id !== id;
          })
        )
      );
      if (form.type === "Income") {
        setTotalIncome(parseInt(totalIncome) - parseInt(form.amount));
        localStorage.setItem(
          "totalIncome",
          JSON.stringify(parseInt(totalIncome) - parseInt(form.amount))
        );
      } else {
        setTotalExpense(parseInt(totalExpense) - parseInt(form.amount));
        localStorage.setItem(
          "totalExpense",
          JSON.stringify(parseInt(totalExpense) - parseInt(form.amount))
        );
      }
      setForm({
        title: "",
        amount: "",
        date: "",
        category: "",
        type: "Income",
      });
      setPlus(false);
      setShowDelete(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredTransactions = transactionArray
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.amount.toString().includes(searchTerm)
    )
    .reverse();

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Sidebar
        isOpen={isOpen}
        showChart={showChart}
        setIsOpen={setIsOpen}
        setShowChart={setShowChart}
        transactionArray={transactionArray}
      />
      {!showChart && (
        <div>
          {plus && (
            <div>
              <div className="w-[96vw] mx-auto relative mt-25 md:mt-40 ">
                <div className="flex flex-col justify-center my-8">
                  <input
                    className="bg-gray-900 p-4 md:p-8 text-base md:text-xl rounded-xl outline-none hover:bg-gray-800 border-1"
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                  />
                  <div className="flex md:flex-row flex-col gap-2 md:gap-4 my-2 md:my-4">
                    <input
                      className="md:w-1/2 w-full bg-gray-900 p-4 md:p-8 text-base md:text-xl rounded-xl outline-none hover:bg-gray-800 border-1"
                      type="text"
                      placeholder="Enter amount"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                    />
                    <input
                      className="md:w-1/2 w-full bg-gray-900 p-4 md:p-8 text-base md:text-xl rounded-xl outline-none hover:bg-gray-800 border-1"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="my-16 flex flex-col gap-5">
                  <label className="text-xl md:text-2xl font-bold">
                    Category
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger className="w-1/2 bg-gray-900 hover:bg-gray-800 p-6 rounded-lg text-base md:text-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white">
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="my-16 flex flex-col gap-5">
                  <label className="text-xl md:text-2xl font-bold">Type</label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
                  >
                    <SelectTrigger className="w-1/2 bg-gray-900 hover:bg-gray-800 p-6 rounded-lg text-base md:text-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white">
                      {types.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  className="absolute text-lg md:text-2xl font-bold bottom-0 right-0 md:bottom-0 md:right-0 bg-gray-800 hover:bg-gray-700 cursor-pointer px-10 py-3 md:py-5 rounded-xl transition-all ease-in-out border"
                  onClick={() => {
                    handleAdd();
                  }}
                >
                  ADD
                </button>

                {showDelete && (
                  <button
                    className="absolute text-lg md:text-2xl font-bold bottom-25 right-0 md:bottom-0 md:right-40 bg-gray-800 hover:bg-gray-700 cursor-pointer px-7 md:px-10 py-3 md:py-5 rounded-xl transition-all ease-in-out border"
                    onClick={() => {
                      handleDelete(form.id);
                    }}
                  >
                    DELETE
                  </button>
                )}
              </div>
              <button
                className="absolute text-2xl font-bold top-10 left-1 md:top-15 md:left-2 cursor-pointer p-4 hover:bg-gray-600 hover:opacity-60 rounded-full transition-all ease-in-out duration-300"
                onClick={() => {
                  handleBack();
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
            </div>
          )}
          {!plus && (
            <div>
              <div className="flex flex-col md:flex-row md:mx-auto justify-center gap-1 md:gap-3 items-center w-full my-2 p-1 md:p-2.5">
                <div className="total-balance text-center  flex flex-row md:flex-col justify-evenly md:justify-center  md:gap-1 w-full md:w-1/3 min-h-[8vh] md:min-h-[20vh] rounded-lg md:rounded-2xl items-center bg-gray-900 hover:bg-gray-800 transition-all ease-in-out ">
                  <h3 className="text-gray-300">Total Balance</h3>
                  <h1 className="font-bold text-2xl md:text-3xl">
                    ₹{totalIncome - totalExpense}
                  </h1>
                </div>
                <div className="total-income  text-center flex flex-row md:flex-col justify-evenly md:justify-center  md:gap-1 w-full md:w-1/3 min-h-[8vh] md:min-h-[20vh] rounded-lg md:rounded-2xl items-center bg-gray-900 hover:bg-gray-800 transition-all ease-in-out ">
                  <h3 className="text-gray-300">Total Income</h3>
                  <h1 className="font-bold text-2xl md:text-3xl">
                    +₹{totalIncome}
                  </h1>
                </div>
                <div className="total-expense text-center  flex flex-row md:flex-col justify-evenly md:justify-center  md:gap-1 w-full md:w-1/3 min-h-[8vh] md:min-h-[20vh] rounded-lg md:rounded-2xl items-center bg-gray-900 hover:bg-gray-800 transition-all ease-in-out ">
                  <h3 className="text-gray-300">Total Expense</h3>
                  <h1 className="font-bold text-2xl md:text-3xl">
                    -₹{totalExpense}
                  </h1>
                </div>
              </div>
              <div className="recent-transactions">
                <h1 className="font-bold text-2xl md:text-3xl m-4 md:m-8">
                  Recent Transactions
                </h1>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-3/4 mx-auto block p-3 mb-4 rounded-lg bg-gray-800 text-white outline-none hover:bg-gray-700"
                />

                <div className="transactions-container mx-auto w-3/4 h-80 md:h-120 overflow-y-scroll">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleEdit(item.id)}
                        className="transaction-card bg-gray-900 p-6 hover:bg-gray-800 cursor-pointer transition-all ease-in-out rounded-2xl my-2"
                      >
                        <div className="flex justify-between items-center">
                          <h1 className="p-2 font-bold text-xl md:text-3xl line-clamp-2 md:truncate md:w-140">
                            {item.title}
                          </h1>
                          <h1 className="p-2 font-bold text-xl md:text-3xl">
                            <div className="flex justify-center items-center gap-1 md:gap-2">
                              {item.type === "Income" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="40px"
                                  viewBox="0 -960 960 960"
                                  width="40px"
                                  fill="#00FF00"
                                >
                                  <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="40px"
                                  viewBox="0 -960 960 960"
                                  width="40px"
                                  fill="#FF0000"
                                >
                                  <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
                                </svg>
                              )}
                              <span>₹{item.amount}</span>
                            </div>
                          </h1>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="p-2 text-sm md:text-xl text-gray-300">
                            {item.category}
                          </p>
                          <p className="p-2 text-sm md:text-xl text-gray-300">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : searchTerm && transactionArray.length > 0 ? (
                    <div className="flex flex-col justify-center items-center md:min-h-[30vh] min-h-[15vh]">
                      <span className="text-2xl md:text-4xl font-bold text-gray-300 animate-pulse w-full mx-auto text-center">
                        No matches found
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center md:min-h-[30vh] min-h-[15vh]">
                      <span className="text-2xl md:text-4xl font-bold text-gray-300 animate-pulse w-full mx-auto text-center">
                        No transactions added yet
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  setPlus(true);
                  setSearchTerm("");
                }}
                className="bg-gray-700 rounded-full p-3 md:p-6 cursor-pointer 
              hover:bg-gray-500 hover:rotate-180 
              shadow-lg hover:shadow-2xl 
              transition-all duration-500 fixed md:right-10 md:bottom-10 right-4 bottom-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#ffffff"
                >
                  <path d="M433-95v-338H95v-94h338v-339h94v339h339v94H527v338h-94Z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  setIsOpen(true);
                  setSearchTerm("");
                }}
                className="bg-gray-700 rounded-full p-3 md:p-6 cursor-pointer 
              hover:bg-gray-500
              shadow-lg hover:shadow-2xl 
              transition-all duration-500 fixed md:left-10 md:bottom-10 left-4 bottom-6 text-white"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/kwnsnjyg.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: "40px", height: "40px" }}
                ></lord-icon>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Manager;
