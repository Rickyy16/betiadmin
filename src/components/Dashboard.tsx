"use client"
import React from "react";
import { useEffect, useState } from "react";
import { MdTimer } from "react-icons/md";
import { ShowToast } from "@/Helpers/ShowToast";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Backdrop from "@mui/material/Backdrop";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface Round {
    roundId: number;
    startTime: string;
    endTime: string;
}

interface Rounds {
    roundId: string;
    startTime: string;
    endTime: string;
    resultNumber: number;
    resultColor: string;
    manualResultNumber: number;
}

interface Bet {
    _id: string;
    roundId: string;
    betType: string;
    betValue: string;
    amount: number;
    status: string;
    payout: number;
    createdAt: string;
}

export default function Dashboard() {
    const [round, setRound] = useState<Round | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [rounds, setRounds] = useState<Rounds[]>([]);
    const [loading, setLoading] = useState(false);
    const currentDate = new Date();

    const [betData, setBetData] = useState({ name: "", value: "#fff", });
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = (val: any) => {
        setModalOpen(true);
        setBetData((pre) => {
            return {
                ...pre, ...val
            }
        });
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };


    async function fetchCurrentRound() {
        const res = await fetch("/api/round/current");
        const data = await res.json();
        setRound(data?.round);
    }

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/round/history");
            const data = await res.json();
            setRounds(data.rounds || []);
        } catch (err) {
            console.error("Error fetching rounds:", err);
        }
    };

    useEffect(() => {
        fetchCurrentRound();
        fetchHistory();
    }, []);

    // 🔹 Timer countdown
    useEffect(() => {
        if (!round) return;

        const end = new Date(round.endTime).getTime();

        const interval = setInterval(() => {

            const now = Date.now();
            const diff = Math.max(0, Math.floor((end - now) / 1000));
            setTimeLeft(diff);

            if (diff === 0) {
                clearInterval(interval);
                setLoading(true);
                // refresh round after result
                setTimeout(() => {
                    fetchCurrentRound();
                    fetchHistory();
                    setLoading(false);
                }, 4000);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [round]);

    // 🔹 Place bet (number or color)
    async function selectBet(manualValue: number | string) {
        if (!round) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/round/${round.roundId}/override`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // auth
                },
                body: JSON.stringify({
                    number: Number(manualValue),
                }),
            });

            const data = await res.json();
            if (res.ok) {
                handleModalClose();
                ShowToast("Number Selected SuccessFully", "success");
            } else {
                ShowToast(data.message || "Failed to Select", "error");
            }
        } catch (err) {
            console.error(err);
            ShowToast("Server error", "error");
        } finally {
            setLoading(false);
        }
    }


    const textColor = (item: any) => {
        if (item?.resultColor === "green") {
            return "text-[#00D659]"
        }
        else if (item?.resultColor === "red") {
            return "text-[#fa3a51]"
        }
        else if (item?.resultColor === "green+violet") {
            return "text-[#b000f0ff]"
        }
        else if (item?.resultColor === "red+violet") {
            return "text-[#b000f0ff]"
        }
        else if (Number(item?.betValue) % 2 == 1 && item?.betValue != "5") {
            return "text-[#00D659]"
        }
        else if (Number(item?.betValue) % 2 == 0 && item?.betValue != "0") {
            return "text-[#fa3a51]"
        }
        else if (item?.betValue === "0" || item?.betValue == "5") {
            return "text-[#b000f0ff]"
        }
    }

    const bgGradient = (item: any) => {
        if (item?.resultColor === "green") {
            return "bg-[linear-gradient(45deg,#04b04c,#00D659)]"
        }
        else if (item?.resultColor === "red") {
            return "bg-[linear-gradient(45deg,#fa3a51,#fa3a51)]"
        }
        else if (item?.resultColor === "green+violet") {
            return "bg-[linear-gradient(180deg,_#b000f0ff_50%,_#00D659_50%)]"
        }
        else if (item?.resultColor === "red+violet") {
            return "bg-[linear-gradient(180deg,_#b000f0ff_50%,_#fa3a51_50%)]"
        }
        else if (item?.betValue === "Green") {
            return "bg-[linear-gradient(45deg,#04b04c,#00D659)]"
        }
        else if (item?.betValue === "Red") {
            return "bg-[linear-gradient(45deg,#fa3a51,#fa3a51)]"
        }
        else if (item?.betValue === "Violet") {
            return "bg-[linear-gradient(45deg,#b000f0ff,#b000f0ff)]"
        }
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: betData?.value,
            },
        },
        typography: {
            fontFamily: "Outfit",
        },
        components: {
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        fontSize: "25px",
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: "20px",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        fontSize: "17px",
                        color: "#fff",
                    },
                },
            },
        },
    });


    if (!round) return <div className="h-[80vh] w-[80vw] flex flex-col justify-center items-center" role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
        Loading round...
    </div>;

    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: 9999 }}
                open={loading}
            >
                <span className="loading loading-infinity loading-xl"></span>
            </Backdrop>
            {/* <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"> */}
            <div className="stats-vertical sm:stats bg-white border-gray-300 border m-1">
                <div className="stat">
                    <div className="col-start-1">
                        <div className="stat-value text-[18px] text-[#101010] text-center flex-center place-self-start">{round?.roundId}</div>
                        <div className="stat-figure text-info bg-gray-300 p-4 rounded mt-3 md:mt-6 flex-center place-self-start">
                            <MdTimer style={{ color: "#000", fontSize: "33px" }} />
                        </div>
                    </div>
                    <div className="stat-actions col-start-2">
                        <div className="stat-value text-[18px] text-[#101010] text-center">Time Remaining</div>
                        <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-3 md:mt-6">
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content bg-rose-500">
                                <span className="countdown font-mono text-5xl">
                                    <span
                                        style={{ "--value": String(Math.floor(timeLeft / 60)) } as React.CSSProperties}
                                        aria-live="polite"
                                        aria-label={`${Math.floor(timeLeft / 60)} minutes`}
                                    >
                                        {Math.floor(timeLeft / 60)}
                                    </span>
                                </span>
                                {/* min */}
                            </div>
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content bg-rose-500">
                                <span className="countdown font-mono text-5xl">
                                    <span
                                        style={{ "--value": String(timeLeft % 60) } as React.CSSProperties}
                                        aria-live="polite"
                                        aria-label={`${timeLeft % 60} seconds`}
                                    >
                                        {timeLeft % 60}
                                    </span>
                                </span>
                                {/* sec */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-value text-xl sm:text-2xl text-rose-600 col-start-2">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex gap-3">
                                <button className="button-num violetred" role="button" onClick={() => handleModalOpen({ name: "0", value: "#b000f0ff", type: "number" })} disabled={loading || timeLeft === 0}>0</button>
                                <button className="button-num green" role="button" onClick={() => handleModalOpen({ name: "1", value: "#00D659", type: "number" })} disabled={loading || timeLeft === 0}>1</button>
                                <button className="button-num red" role="button" onClick={() => handleModalOpen({ name: "2", value: "#F0003C", type: "number" })} disabled={loading || timeLeft === 0}>2</button>
                                <button className="button-num green" role="button" onClick={() => handleModalOpen({ name: "3", value: "#00D659", type: "number" })} disabled={loading || timeLeft === 0}>3</button>
                                <button className="button-num red" role="button" onClick={() => handleModalOpen({ name: "4", value: "#F0003C", type: "number" })} disabled={loading || timeLeft === 0}>4</button>
                            </div>
                            <div className="flex gap-3">
                                <button className="button-num violetgreen" role="button" onClick={() => handleModalOpen({ name: "5", value: "#b000f0ff", type: "number" })} disabled={loading || timeLeft === 0}>5</button>
                                <button className="button-num red" role="button" onClick={() => handleModalOpen({ name: "6", value: "#F0003C", type: "number" })} disabled={loading || timeLeft === 0}>6</button>
                                <button className="button-num green" role="button" onClick={() => handleModalOpen({ name: "7", value: "#00D659", type: "number" })} disabled={loading || timeLeft === 0}>7</button>
                                <button className="button-num red" role="button" onClick={() => handleModalOpen({ name: "8", value: "#F0003C", type: "number" })} disabled={loading || timeLeft === 0}>8</button>
                                <button className="button-num green" role="button" onClick={() => handleModalOpen({ name: "9", value: "#00D659", type: "number" })} disabled={loading || timeLeft === 0}>9</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Dialog
                    maxWidth={"lg"}
                    open={modalOpen}
                // onClose={() => handleModalClose()}
                >
                    <div className="p-[24px] pb-[4px] w-[200px]">
                        <h3 className="font-bold text-lg">
                            Are you sure ?
                        </h3>
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-lg"
                            onClick={() => handleModalClose()}
                        >
                            ✕
                        </button>
                    </div>
                    <ThemeProvider theme={theme}>
                        <DialogContent
                            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                        >

                        </DialogContent>
                        <Button
                            variant="contained"
                        onClick={() => selectBet(betData?.name)}
                        >
                            Select - {betData?.name}
                        </Button>
                    </ThemeProvider>
                </Dialog>
            </div>
             <div className="h-[50vh] overflow-x-scroll">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200 whitespace-nowrap border-b sticky top-0">
                  <tr>
                    <th className="p-4 text-left text-[13px] font-semibold text-[#101010]">
                      Period
                    </th>
                    {/* <th className="p-4 text-left text-[13px] font-semibold text-[#101010]">
                  Start At
                </th>
                <th className="p-4 text-left text-[13px] font-semibold text-[#101010]">
                  End At
                </th> */}
                    <th className="p-4 text-left text-[13px] font-semibold text-[#101010]">
                      Number
                    </th>
                    <th className="p-4 text-left text-[13px] font-semibold text-[#101010]">
                      Color
                    </th>
                  </tr>
                </thead>

                <tbody className="whitespace-nowrap">
                  {rounds?.filter((item) => currentDate > new Date(item?.endTime))?.map((item, index) => {
                    return <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 text-[15px] text-slate-900 font-medium">
                        {item?.roundId}
                      </td>
                      {/* <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {item?.startTime}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {item?.endTime}
                  </td> */}
                      <td className={`p-4 ${textColor(item)} font-extrabold text-[22px]`}>
                        {item?.resultNumber}
                        {/* <div className="flex items-center">
                      <button className="mr-3 cursor-pointer" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-blue-500 hover:fill-blue-700"
                          viewBox="0 0 348.882 348.882">
                          <path
                            d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                            data-original="#000000" />
                          <path
                            d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                            data-original="#000000" />
                        </svg>
                      </button>
                      <button title="Delete" className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000" />
                          <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000" />
                        </svg>
                      </button>
                    </div> */}
                      </td>
                      <td className="p-4">
                        <button
                          className={`outline-0 [--sz-btn:28px] h-[var(--sz-btn)] w-[var(--sz-btn)] border border-solid border-transparent rounded-3xl ${bgGradient(item)} [box-shadow:#3c40434d_0_1px_2px_0,#3c404326_0_2px_6px_2px,#0000004d_0_30px_60px_-30px,#34343459_0_-2px_6px_0_inset]`}
                        >
                        </button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            {/* </div> */}
        </>
    );
}
