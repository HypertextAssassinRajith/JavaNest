"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CoffeeCup from '@/app/assets/coffee-cup.png';
import Background from '@/app/assets/coffee-background.png';

interface Table {
  id: string;
  number: number;
  capacity: number;
}

export default function TableBooking() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    time: '18:00',
    people: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
    subscribe: false,
    tableId: '',
  });

  const [availableTables, setAvailableTables] = useState<Table[]>([]);

  useEffect(() => {
    if (formData.date) {
      axios
        .get(`http://localhost:3000/bookings/available?date=${formData.date}`)
        .then((response) => setAvailableTables(response.data))
        .catch((error) =>
          console.error('Error fetching tables:', error)
        );
    }
  }, [formData.date]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    });
    if (name === 'time') {
      toast.info(`Time selected: ${value}`);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formData.tableId) {
      toast.error('Please select an available table!');
      return;
    }

    const bookingData = {
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      email: formData.email,
      date: `${formData.date}T${formData.time}:00.000Z`,
      notes: formData.comments,
      tableId: formData.tableId,
    };

    try {
      await axios.post('http://localhost:3000/bookings', bookingData);
      toast.success('Booking successful!');
      

      setFormData({
        date: '',
        time: '18:00',
        people: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        comments: '',
        subscribe: false,
        tableId: '',
      });
      

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      toast.error('Booking failed. Try again.');
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <div
      className="relative flex flex-col lg:flex-row items-center justify-evenly min-h-screen bg-cover bg-center bg-no-repeat px-6 lg:px-20"
      style={{ backgroundImage: `url(${Background.src})` }}
    >
      <div className="w-full lg:w-1/2 max-w-lg p-6 bg-white rounded-lg shadow-md mb-6 lg:mb-0">
        <h2 className="text-2xl font-semibold mb-4 text-black">BOOKING</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              className="p-2 border rounded text-black"
              required
              onChange={handleChange}
              value={formData.date}
            />
            <select
              name="time"
              className="p-2 border rounded text-black"
              value={formData.time}
              onChange={handleChange}
            >
              <option>17:00</option>
              <option>18:00</option>
              <option>19:00</option>
              <option>20:00</option>
              <option>21:00</option>
              <option>22:00</option>
              <option>23:00</option>
            </select>
          </div>
          {formData.date && (
            <select
              name="tableId"
              className="w-full p-2 border rounded text-black"
              required
              onChange={handleChange}
              value={formData.tableId}
            >
              <option value="">Select a Table</option>
              {availableTables.length > 0 ? (
                availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    Table {table.number} (Seats {table.capacity})
                  </option>
                ))
              ) : (
                <option disabled>No tables available</option>
              )}
            </select>
          )}
          <input
            type="number"
            name="people"
            placeholder="People"
            className="w-full p-2 border rounded text-black placeholder-gray-600"
            required
            onChange={handleChange}
            value={formData.people}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className="p-2 border rounded text-black placeholder-gray-600"
              required
              onChange={handleChange}
              value={formData.firstName}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className="p-2 border rounded text-black placeholder-gray-600"
              required
              onChange={handleChange}
              value={formData.lastName}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded text-black placeholder-gray-600"
            required
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full p-2 border rounded text-black placeholder-gray-600"
            required
            onChange={handleChange}
            value={formData.phone}
          />
          <textarea
            name="comments"
            placeholder="Comments (optional)"
            className="w-full p-2 border rounded text-black placeholder-gray-600"
            onChange={handleChange}
            value={formData.comments}
          ></textarea>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="subscribe"
              className="mr-2"
              onChange={handleChange}
              checked={formData.subscribe}
            />
            <label className="text-black">
              Subscribe me to the newsletter
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg cursor-pointer bg-[#8B5A2B] px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-[#a57242]"
          >
            Book a table
          </button>
        </form>
      </div>
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image
          src={CoffeeCup}
          alt="Coffee Cup"
          width={500}
          height={500}
          className="drop-shadow-lg hidden md:block"
        />
      </div>
      <ToastContainer />
    </div>
  );
}
