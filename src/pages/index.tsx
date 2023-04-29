import { Button, Container } from "@mui/material";
import { type NextPage } from "next";

import firebase_app from "~/utils/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import { useState, useEffect } from "react";

type LogPayload = {
  id: string;
  message: string;
  timestamp: string;
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "message", headerName: "Message", width: 500 },
  { field: "timestamp", headerName: "Timestamp", width: 200 },
];

const Home: NextPage = () => {
  const [logs, setLogs] = useState<LogPayload[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogPayload | null>(null);
  const [dataGridPage, setDataGridPage] = useState(0);
  const [dataGridPageSize, setDataGridPageSize] = useState(10);
  const db = getFirestore(firebase_app);

  useEffect(() => {
    let unsub = () => {};
    const fetchLogs = async () => {
      const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
      unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp).toLocaleString(),
        })) as LogPayload[];
        setLogs(data);
      });
    };
    fetchLogs();
    return () => {
      unsub();
    };
  }, []);

  console.log(logs);

  return (
    <>
      <Container className="grid gap-5 p-5">
        {selectedLog && (
          <div className="grid gap-5 p-5">
            <h1 className="text-xl font-bold">{selectedLog.timestamp}</h1>
            <div>
              <span>Message:</span>
              <pre className="whitespace-pre-wrap rounded bg-slate-900 p-5 text-white">
                <code>{selectedLog.message}</code>
              </pre>
            </div>
          </div>
        )}
        <DataGrid
          className="m-5"
          rows={logs}
          columns={columns}
          paginationModel={{ page: dataGridPage, pageSize: dataGridPageSize }}
          autoHeight
          onRowClick={(params) => {
            setSelectedLog(params.row as LogPayload);
          }}
          onPaginationModelChange={
            ((model: GridPaginationModel) => {
              setDataGridPage(model.page);
              setDataGridPageSize(model.pageSize);
            }) as any
          }
        />
      </Container>
    </>
  );
};

export default Home;
