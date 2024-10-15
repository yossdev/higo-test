"use client";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PieChartGender } from "@/components/charts/pie-chart";
import { BarChartProfessionByGender } from "@/components/charts/bar-chart";
import { AreaChartMeanSpedingScoreByAgeAndGender } from "@/components/charts/area-chart";
import { RadarChartAnnualIncomeByProfession } from "@/components/charts/radar-chart";
import { SummaryStatistics } from "@/components/summary-statistics";

export default function Home() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [controlDisabled, setControlDisabled] = useState(false);

  const [genderData, setGenderData] = useState([]);
  const [professionByGender, setProfessionByGender] = useState([]);
  const [meanSpendingScoreByAgeAndGender, setMeanSpendingScoreByAgeAndGender] =
    useState([]);
  const [meanAnnualIncomeByProfession, setMeanAnnualIncomeByProfession] =
    useState([]);
  const [summaryStatistics, setSummaryStatistics] = useState({});
  const [dataTable, setDataTable] = useState({
    totalPages: 0,
    customers: [],
  });
  const [tablePage, setTablePage] = useState({
    pageIndex: Math.max(0, +searchParams.get("page") || 0),
    pageSize: 10,
  });

  const addNewCustomer = () => {
    setControlDisabled(true);
    socket.emit("addCustomer", {
      Gender: "Male",
      Age: 20,
      AnnualIncome: 15000,
      SpendingScore: 30,
      Profession: "Engineer",
      WorkExperience: 1,
      FamilySize: 1,
      page: tablePage.pageIndex,
      size: tablePage.pageSize,
    });
  };

  const updateCustomer = () => {
    setControlDisabled(true);
    const gender = dataTable.customers[0].Gender;
    socket.emit("updateCustomer", {
      id: dataTable.customers[0]._id,
      body: {
        Gender: gender === "Female" ? "Male" : "Female",
      },
    });
  };

  const deleteCustomer = () => {
    setControlDisabled(true);
    socket.emit("deleteCustomer", {
      id: dataTable.customers[0]._id,
    });
  };

  useEffect(() => {
    socket.emit("dataTable", {
      page: tablePage.pageIndex,
      size: tablePage.pageSize,
    });
    const params = new URLSearchParams(searchParams);
    if (tablePage.pageIndex <= 0) {
      params.delete("page");
    } else {
      params.set("page", tablePage.pageIndex);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [tablePage.pageIndex]);

  useEffect(() => {
    socket.on("countGender", (response) => {
      if (response.success) {
        setGenderData(
          response.data.map((v) => {
            if (v._id === "Male") {
              return { ...v, fill: "var(--color-Male)" };
            }
            return { ...v, fill: "var(--color-Female)" };
          })
        );
      } else {
        console.error("Error:", response.error);
      }
    });

    socket.on("countProfessionByGender", (response) => {
      if (response.success) {
        setProfessionByGender(response.data);
      } else {
        console.error("Error:", response.error);
      }
    });

    socket.on("meanSpendingScoreByAgeAndGender", (response) => {
      if (response.success) {
        setMeanSpendingScoreByAgeAndGender(response.data);
      } else {
        console.error("Error:", response.error);
      }
    });

    socket.on("meanAnnualIncomeByProfession", (response) => {
      if (response.success) {
        setMeanAnnualIncomeByProfession(response.data);
      } else {
        console.error("Error:", response.error);
      }
    });

    socket.on("summaryStatistics", (response) => {
      if (response.success) {
        setSummaryStatistics(response.data);
      } else {
        console.error("Error:", response.error);
      }
    });

    socket.on("dataTableResp", (response) => {
      if (response.success) {
        setDataTable(response.data);
      } else {
        console.error("Error:", response.error);
      }
      setControlDisabled(false);
    });

    socket.on("updatedCustomer", (response) => {
      if (response.success) {
        setDataTable((prev) => {
          const c = prev.customers;
          const updatedCust = c.map((r) =>
            r._id === response.data._id ? response.data : r
          );

          return {
            ...prev,
            customers: updatedCust,
          };
        });
      } else {
        console.error("Error:", response.error);
      }
      setControlDisabled(false);
    });

    socket.on("deletedCustomer", (response) => {
      if (response.success) {
        setDataTable((prev) => {
          const c = prev.customers;
          const updatedCust = c.filter((r) => r._id !== response.id);

          return {
            ...prev,
            customers: updatedCust,
          };
        });
      } else {
        console.error("Error:", response.error);
      }
      setControlDisabled(false);
    });
  }, [socket]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    console.log(
      `Status: ${isConnected ? "connected" : "disconnected"}`,
      "\n",
      `Transport: ${transport}`
    );
  }, [isConnected, transport]);

  return (
    <div>
      <main className="pb-10">
        <h1 className="text-3xl font-bold my-10">Customers Dashboard</h1>

        <SummaryStatistics data={summaryStatistics} />

        <div className="grid grid-cols-2 h-fit my-10 gap-7">
          <PieChartGender data={genderData} />
          <BarChartProfessionByGender data={professionByGender} />
          <AreaChartMeanSpedingScoreByAgeAndGender
            data={meanSpendingScoreByAgeAndGender}
          />
          <RadarChartAnnualIncomeByProfession
            data={meanAnnualIncomeByProfession}
          />
        </div>

        <div className="rounded shadow border my-5 px-3.5">
          <DataTable
            columns={columns}
            data={dataTable}
            tablePage={tablePage}
            setTablePage={setTablePage}
            addNewCustomer={addNewCustomer}
            deleteCustomer={deleteCustomer}
            updateCustomer={updateCustomer}
            controlDisabled={controlDisabled}
          />
        </div>
      </main>
    </div>
  );
}
