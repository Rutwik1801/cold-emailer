import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { db } from '../store/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { colorSchemeDark } from 'ag-grid-community';
import { ToastContainer, toast } from 'react-toastify';

import { sendEmail } from '../utils';

const myTheme = themeQuartz.withPart(colorSchemeDark);

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Dashboard() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'outreach'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRowData(data);
    };
    fetchData();
  }, []);

  const handleFollowUp = async (data) => {
    toast.info("Sending Follow Up...")
    try {
      await sendEmail(data.id, true)
      toast.success("Sent Successfully!")
    } catch(e) {
      toast.error("Error Sending The Mail")
    }
  }

  const columnDefs = [
    { field: 'company' },
    { field: 'recipient' },
    { field: 'email' },
    { field: 'followUpAfterDays' },
    {
      field: "actions",
      headerName: 'Actions',
      cellRenderer: (params) => (
        <button
          onClick={() => handleFollowUp(params.data)}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          Follow Up
        </button>
      ),
    },
  ];

  return (
    <div  style={{ height: 500, width: '100%' }}>
      <AgGridReact theme={myTheme} rowData={rowData} columnDefs={columnDefs}  />
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} />
    </div>
  );
}
