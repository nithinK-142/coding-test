import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { IEmployee } from "@/constants";

interface EmployeeContextType {
  employees: IEmployee[];
  setEmployees: React.Dispatch<React.SetStateAction<IEmployee[]>>;
  getEmployees: () => Promise<void>;
  createEmployee: (employeeData: FormData) => Promise<void>;
  updateEmployee: (id: string, employeeData: FormData) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployeeById: (id: string) => Promise<IEmployee>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  return context;
};

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  const getEmployees = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}`);
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const createEmployee = async (employeeData: FormData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}`, employeeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await getEmployees();
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: FormData) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/${id}`, employeeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await getEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`);
      await getEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  };

  const getEmployeeById = async (id: string): Promise<IEmployee> => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/${id}`);
      return data.employee;
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw error;
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        getEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
