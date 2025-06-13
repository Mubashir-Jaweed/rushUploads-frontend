"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuDownload, LuMenu } from "react-icons/lu";
import { HiViewGrid } from "react-icons/hi";
import { IoIosLink, IoIosSearch } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";
import { formatFileSize } from "@/lib/utils";
import { useUserContext } from "@/contexts/user";

const Workspace = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuerry, setSearchQuerry] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();
    const { id, file } = useParams();
    const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({});
    const progressRef = useRef<{[key: string]: number}>({});

    const [isAds, setIsAds] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [adBannerUrl, setAdBannerUrl] = useState('');
    const [count, setCount] = useState(5);
    const [showClose, setShowClose] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout>();
    const { token } = useUserContext();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/settings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.data.value === 'ON') {
                    trackAdView()
                }
                setIsAds(response.data.data.value === 'ON' ? true : false);
                setRedirectUrl(response.data.data.redirectUrl ?? '')
                setAdBannerUrl(response.data.data.bannerUrl ?? '')
            } catch (error) {
                console.error('Failed to fetch monetization:', error);
            }
        };

        fetchSettings();
    }, [token]);

    const trackAdView = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ads/view`);
        } catch (error) {
            console.error('Ad view tracking failed');
        }
    };

    const trackAdClick = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ads/click`);
        } catch (error) {
            console.error('Ad click tracking failed');
        }
    };

    useEffect(() => {
        getFiles();

        setCount(5)
        setShowClose(false)
        intervalRef.current = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    setShowClose(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const filteredFiles = files.filter((file) =>
        file.originalName.toLowerCase().includes(searchQuerry.toLowerCase()),
    );

    const getFiles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/link/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.data.link.files) {
                const filteredFile = response.data.data.link.files.find(
                    (f) => f.id === file
                );

                if (filteredFile) {
                    setFiles([filteredFile]);
                    setTitle(response.data.data.link.title);
                    setDescription(response.data.data.link.message);
                } else {
                    setFiles([]);
                }
            }
        } catch (error) {
            console.error("Error getting files:", error);
        } finally {
            setLoading(false);
        }
    };

    async function downloadFile(fileId: string, fileName: string) {
        setDownloadingFileId(fileId);
        setDownloadProgress(prev => ({...prev, [fileId]: 0}));
        progressRef.current = {...progressRef.current, [fileId]: 0};
        
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/download/${fileId}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response && response.data.url) {
                const downloadResponse = await fetch(response.data.url);
                const reader = downloadResponse.body?.getReader();
                const contentLength = parseInt(downloadResponse.headers.get('Content-Length') || '0');
                let receivedLength = 0;
                const chunks = [];
                
                if (reader) {
                    while(true) {
                        const {done, value} = await reader.read();
                        
                        if (done) break;
                        
                        chunks.push(value);
                        receivedLength += value.length;
                        const progress = Math.round((receivedLength / contentLength) * 100);
                        
                        progressRef.current = {...progressRef.current, [fileId]: progress};
                        setDownloadProgress({...progressRef.current});
                    }
                }
                
                const blob = new Blob(chunks);
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            }
        } catch (error) {
            toast.error("Download failed");
            console.error('Error downloading file:', error);
        } finally {
            setDownloadingFileId(null);
            setDownloadProgress(prev => {
                const newProgress = {...prev};
                delete newProgress[fileId];
                return newProgress;
            });
            delete progressRef.current[fileId];
        }
    }

    const copyUrl = (url: string, file: String) => {
        navigator.clipboard.writeText(`https://rushuploads.com/${url}/${file}`);
        toast('Url Copied')
    };

    const hideTxt = (txt: string) => {
        const [username, domain] = txt.split('@');

        if (username.length <= 4) {
            return '*'.repeat(username.length) + '@' + domain;
        }

        const visibleStart = username.slice(0, 4);
        const hiddenLength = username.length - 4;
        const hiddenPart = '*'.repeat(hiddenLength);
        return `${visibleStart}${hiddenPart}@${domain}`;
    }

    return (
        <div>
            <Navbar />
            <div className=" w-full h-screen auth-bg flex items-end">
                {isAds && adBannerUrl.length > 0 && redirectUrl.length > 0 ? (
                    <div className="bg-[#333333] text-gray-400 flex justify-center items-center h-[96%] w-[98%] fixed z-50 top-[2%] left-[1%] rounded-xl overflow-hidden">
                        <div
                            onClick={() => showClose ? setIsAds(false) : null}
                            className="bg-white cursor-pointer uppercase text-sm font-normal text-stone-900 rounded-xl px-3 py-2 absolute top-3 right-3 z-10"
                        >
                            {showClose ? 'Close Ad' : `Generating Link | ad skip in ${count}`}
                        </div>

                        <div className=" relative h-[90%] w-[90%] flex justify-center items-center">
                            <a
                                href={redirectUrl}
                                onClick={() => trackAdClick()}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {['.mp4', '.webm', '.mov'].some(ext => adBannerUrl.includes(ext)) ? (
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        controls={false}
                                        className="max-w-[80%] min-w-[500px] max-h-[90%] object-cover rounded"
                                        onError={(e) => console.error('Video failed to load', e)}
                                    >
                                        <source src={adBannerUrl} type={`video/${adBannerUrl.split('.').pop()}`} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : adBannerUrl.endsWith('.html') ? (
                                    <iframe
                                        src={adBannerUrl}
                                        className="max-w-[80%] min-w-[500px] max-h-[90%] object-cover rounded border-none"
                                        title="Advertisement"
                                    />
                                ) : (
                                    <img
                                        src={adBannerUrl}
                                        alt="Advertisement"
                                        className="max-w-[80%] min-w-[500px] max-h-[90%] rounded object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src = '/fallback-ad-image.jpg';
                                        }}
                                    />
                                )}
                            </a>
                        </div>
                    </div>
                ) :null}
                <div className=" w-full  h-[87vh] flex  justify-center pt-11  gap-10 overflow-style">
                    <div className="  w-[80%] h-[80vh] flex flex-col gap-2 justify-start items-start p-5">
                        {title ? (
                            <span className="text-stone-800 text-3xl max-sm:text-2xl font-semibold">
                                {title}
                            </span>
                        ) : (
                            <span className="text-stone-800 text-3xl max-sm:text-2xl font-semibold">
                                Preview files
                            </span>
                        )}
                        {description && (
                            <span className="text-lg font-normal text-zinc-600">
                                {description}
                            </span>
                        )}
                        <div className="relative w-full border-b my-5 pb-1 border-zinc-400 flex justify-between items-end">
                            {/* Underline Element */}
                        </div>
                        <div className="rounded-[8px] upload-input flex justify-between items-center w-full mb-4">
                            <IoIosSearch className="text-2xl ml-3 text-stone-600" />
                            <input
                                type="email"
                                value={searchQuerry}
                                onChange={(e) => setSearchQuerry(e.target.value)}
                                placeholder="Search by file name"
                                className="bg-transparent   text-lg font-normal p-3 outline-none h-full w-[96%]  placeholder:text-zinc-500  text-stone-800"
                            />
                        </div>
                        <div className=" p-2 w-full  flex flex-wrap justify-start items-start gap-2">
                            {files.length !== 0 && !loading ? (
                                filteredFiles.map((val, i) => (
                                    <div key={i} className="hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col  justify-center items-center rounded-[8px] p-3">
                                        <span className="text-lg font-medium overflow-hidden w-full text-stone-800">
                                            {val.originalName}
                                        </span>
                                       
                                        <div className="flex w-full justify-between items-end">
                                            <div className="flex justify-start items-center gap-3">
                                                <span className="max-sm:hidden text-sm font-[500] text-zinc-500">
                                                    {hideTxt(val.user.email)}
                                                </span>
                                                <span className="max-sm:hidden text-xs font-[500] text-zinc-500">
                                                    {val.updatedAt.split("T")[0]}
                                                </span>
                                                <span className=" text-xs font-[500] text-zinc-500">
                                                    ({formatFileSize(val.size)})
                                                </span>
                                                {val.isExpired && (
                                                    <span className="max-sm:hidden text-sm font-normal text-zinc-700">
                                                        Expired
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-center gap-2 items-center ">
                                                <a
                                                    download={true}
                                                    onClick={() => downloadFile(val.id, val.originalName)}
                                                    className="list-btn-title-cont delay-5ms bg-[#32323218] text-stone-800 p-2 rounded text-sm font-medium flex justify-center items-center"
                                                    disabled={downloadingFileId === val.id}
                                                >
                                                    {downloadingFileId === val.id ? (
                                                        <>
                                                            {downloadProgress[val.id] || 0}%
                                                            <span className="list-btn-title">Downloading</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Download
                                                            <span className="list-btn-title">Download</span>
                                                        </>
                                                    )}
                                                </a>
                                                <span
                                                    onClick={() => copyUrl(id, val.id)}
                                                    className="list-btn-title-cont  delay-5ms bg-[#32323218] text-stone-800 p-2 rounded text-sm font-medium flex justify-center items-center"
                                                >
                                                    Copy link
                                                    <span className="list-btn-title">Copy_Link</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : loading ? (
                                <div className="w-full flex justify-center">
                                    <svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="none">
                                        <circle cx="25" cy="25" r="20" stroke="#ff4262" stroke-width="4" stroke-linecap="round" fill="none"
                                            stroke-dasharray="100" stroke-dashoffset="0">
                                            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"
                                                dur="0.5s" repeatCount="indefinite" />
                                            <animate attributeName="stroke-dashoffset" values="100;0" dur="1s" repeatCount="indefinite" />
                                        </circle>
                                    </svg>
                                </div>
                            ) : (
                                <div className="text-stone-800 text-xl font-normal  w-full h-28 flex flex-col gap-3 justify-center items-center">
                                    <span className="text-center">
                                        Files not found! <span className=" underline cursor-pointer" onClick={() => getFiles()}>Please reload</span>.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;