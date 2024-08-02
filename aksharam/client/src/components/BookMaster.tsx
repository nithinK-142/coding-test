import { useEffect, useState } from "react";
import pencil from "../assets/pencil.svg";
import axios from "axios";

interface Bookdata {
  bookcode: string;
  booknamesa: string;
  bookname: string;
  sellingprice: string;
  costprice: string;
}

export default function BookMaster() {
  const [bookData, setBookData] = useState<Bookdata[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Bookdata>({
    bookcode: "",
    booknamesa: "",
    bookname: "",
    sellingprice: "",
    costprice: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const editBook = (book: Bookdata) => {
    setFormData(book);
  };

  const handleSave = async () => {
    const message = await saveBookData();
    alert(message);
  };

  async function saveBookData() {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/saveBookData", {
        formData,
      });
      return response.data.message;
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
              <th scope="col" className="px-5 py-3">
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
                  name="bookcode"
                  value={formData.bookcode}
                  onChange={handleInputChange}
                  className="px-4 py-1 rounded-md border-2 border-gray-400"
                />
              </td>
              <td className="px-5 py-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="booknamesa"
                    value={formData.booknamesa}
                    onChange={handleInputChange}
                    className="px-4 py-1 rounded-md border-2 border-gray-400"
                  />
                  <input
                    type="text"
                    name="bookname"
                    value={formData.bookname}
                    onChange={handleInputChange}
                    className="px-4 py-1 rounded-md border-2 border-gray-400"
                  />
                </div>
              </td>
              <td className="px-5 py-4">
                <input
                  type="text"
                  name="sellingprice"
                  value={formData.sellingprice}
                  onChange={handleInputChange}
                  className="px-4 py-1 rounded-md border-2 border-gray-400"
                />
              </td>
              <td className="px-5 py-4">
                <input
                  type="text"
                  name="costprice"
                  value={formData.costprice}
                  onChange={handleInputChange}
                  className="px-4 py-1 rounded-md border-2 border-gray-400"
                />
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={handleSave}
                  className="px-2 py-1 bg-gray-300 rounded-md"
                >
                  Save
                </button>
              </td>
            </tr>
          </tbody>
          <tbody className="floating-scrollbar">
            {bookData.map((book, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-5 py-4">{book.bookcode}</td>
                <td className="px-5 py-4">
                  {book.booknamesa} / {book.bookname}
                </td>
                <td className="px-5 py-4">{book.sellingprice}</td>
                <td className="px-5 py-4">{book.costprice}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-2 px-2">
                    <img
                      src={pencil}
                      alt="Edit"
                      onClick={() => editBook(book)}
                      className="h-6 cursor-pointer"
                    />
                    <button className="text-xl">❌</button>
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
// import { useState } from "react";
// import bookdata from "../assets/bookdata.json";
// import pencil from "../assets/pencil.svg";

// interface Bookdata {
//   bookcode: number;
//   booknamesa: string;
//   bookname: string;
//   sellingprice: number;
//   costprice: number;
// }
// export default function BookMaster() {
//   const [bookData, setBookData] = useState();
//   return (
//     <div>
//       <h1 className="text-center text-2xl font-semibold py-6">Book Master</h1>

//       <div className="relative overflow-x-auto">
//         <table className="w-full text-sm text-left rtl:text-right text-black">
//           <thead className="text-xs text-black uppercase bg-gray-300">
//             <tr>
//               <th scope="col" className="px-5 py-3">
//                 Book Code
//               </th>
//               <th scope="col" className="px-5 py-3">
//                 Book Name
//               </th>
//               <th scope="col" className="px-5 py-3">
//                 Selling Price
//               </th>
//               <th scope="col" className="px-5 py-3">
//                 Cost Price
//               </th>
//               <th scope="col" className="px-5 py-3">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="bg-white border-b">
//               <td className="px-5 py-4">
//                 <input
//                   type="text"
//                   className="px-4 py-1 rounded-md border-2 border-gray-400"
//                 />
//               </td>
//               <td className="px-5 py-4 flex space-x-2">
//                 <input
//                   type="text"
//                   className="px-4 py-1 rounded-md border-2 border-gray-400"
//                 />
//                 <input
//                   type="text"
//                   className="px-4 py-1 rounded-md border-2 border-gray-400"
//                 />
//               </td>
//               <td className="px-5 py-4">
//                 <input
//                   type="text"
//                   className="px-4 py-1 rounded-md border-2 border-gray-400"
//                 />
//               </td>
//               <td className="px-5 py-4">
//                 <input
//                   type="text"
//                   className="px-4 py-1 rounded-md border-2 border-gray-400"
//                 />
//               </td>

//               <td className="px-5 py-4">
//                 <button className="px-2 py-1 bg-gray-300 rounded-md">
//                   save
//                 </button>
//               </td>
//             </tr>
//           </tbody>
//           <tbody>
//             {bookdata.map((book) => (
//               <tr className="bg-white border-b">
//                 <td className="px-5 py-4">{book.bookcode}</td>
//                 <td className="px-5 py-4">{book.booknamesa}</td>
//                 <td className="px-5 py-4">{book.bookname}</td>
//                 <td className="px-5 py-4">{book.sellingprice}</td>
//                 <td className="px-5 py-4">{book.quantity}</td>
//                 <td className="px-5 py-4">
//                   <div>
//                     <img
//                       src={pencil}
//                       alt="Pencil"
//                       className="h-10 cursor-pointer"
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
