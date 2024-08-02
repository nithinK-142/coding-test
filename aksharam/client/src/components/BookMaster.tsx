import { useEffect, useState } from "react";
import pencil from "../assets/pencil.svg";
import axios from "axios";

interface Bookdata {
  BookCode: string;
  BookNameSa: string;
  BookNameEn: string;
  ItemId: string;
  SellingPrice: string;
  Quantity: string;
}

const defaultFormData = {
  BookCode: "",
  BookNameSa: "",
  BookNameEn: "",
  ItemId: "",
  SellingPrice: "",
  Quantity: "",
};

export default function BookMaster() {
  const [bookData, setBookData] = useState<Bookdata[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Bookdata>(defaultFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleDelete(itemid: string) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteBookData/${itemid}`
      );
      fetchBookData();
      console.log(response.data.message);
      return response.data.message;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const editBook = (book: Bookdata) => {
    setFormData(book);
  };

  const handleSave = async () => {
    const message = await saveBookData();
    setFormData(defaultFormData);
    alert(message);
  };

  async function saveBookData() {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/saveBookData", {
        formData,
      });

      return response.data.message;
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookData() {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/getBookData");
      setBookData(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookData();
  }, []);

  if (loading) return <p>loading...</p>;

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold py-6">Book Master</h1>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-black">
          <thead className="text-xs text-black uppercase bg-gray-300">
            <tr>
              <th scope="col" className="px-5 py-3">
                Book Code
              </th>
              <th scope="col" className="px-5 py-3 text-center">
                Book Name
              </th>
              <th scope="col" className="px-5 py-3">
                Selling Price
              </th>
              <th scope="col" className="px-5 py-3">
                Cost Price
              </th>
              <th scope="col" className="px-5 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b">
              <td className="px-5 py-4">
                <input
                  type="text"
                  name="BookCode"
                  value={formData.BookCode}
                  onChange={handleInputChange}
                  className="px-4 py-1 rounded-md border-2 border-gray-400 w-[80%]"
                />
              </td>
              <td className="px-5 py-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="BookNameSa"
                    value={formData.BookNameSa}
                    onChange={handleInputChange}
                    className="px-4 py-1 rounded-md border-2 border-gray-400 w-full"
                  />
                  <input
                    type="text"
                    name="BookNameEn"
                    value={formData.BookNameEn}
                    onChange={handleInputChange}
                    className="px-4 py-1 rounded-md border-2 border-gray-400 w-full"
                  />
                </div>
              </td>
              <td className="px-5 py-4">
                <input
                  type="text"
                  name="SellingPrice"
                  value={formData.SellingPrice}
                  onChange={handleInputChange}
                  className="px-4 py-1 rounded-md border-2 border-gray-400 w-[90%]"
                />
              </td>
              <td className="px-5 py-4">
                <input
                  type="text"
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleInputChange}
                  className="px-4 py-1 rounded-md border-2 border-gray-400 w-[90%]"
                />
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={handleSave}
                  className="px-2.5 py-1.5 bg-gray-300 rounded-md"
                >
                  Save
                </button>
              </td>
            </tr>
          </tbody>
          <tbody className="floating-scrollbar">
            {bookData.map((book, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-5 py-4">{book.BookCode}</td>
                <td className="px-5 py-4">
                  {book.BookNameSa} / {book.BookNameEn}
                </td>
                <td className="px-5 py-4">{book.SellingPrice}</td>
                <td className="px-5 py-4">{book.Quantity}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-2 px-2">
                    <img
                      src={pencil}
                      alt="Edit"
                      onClick={() => editBook(book)}
                      className="h-6 cursor-pointer"
                    />
                    <button
                      onClick={() => handleDelete(book.ItemId)}
                      className="text-xl"
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
