import React, { useState } from "react";
import { IoIosLink } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CardDataProps {
  data: {
    id: string;
    originalName: string;
    updatedAt: string;
    url: string;
    date: string;
    isExpired: boolean;
    downloads: number;
    downloadedAt: string[];
    link: {
      id: string;
    };
  };
  status: string;
  deleteFile: () => void;
  [key: string]: unknown;
}

const ListCard = ({ data, status, deleteFile }: CardDataProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const copyUrl = (url: string, file: string) => {
    navigator.clipboard.writeText(`https://rushuploads.com/${url}/${file}`);
    toast('Url Copied');
  };

  async function downloadFile(url: string, filename: string) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error in downloading file');
    }
  }

  function formatDownloadNumber(num: number) {
    if (num < 1000) return num.toString();
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  }

  function truncateString(str: string): string {
    const lastDotIndex = str.lastIndexOf('.');
    
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return str.length > 10 ? str.substring(0, 10) + '...' : str;
    }
  
    const namePart = str.substring(0, lastDotIndex);
    const extension = str.substring(lastDotIndex);
  
    if (namePart.length > 10) {
      return namePart.substring(0, 10) + '...' + extension;
    }
  
    return str;
  }

  const prepareChartData = () => {
    // Group downloads by date
    const downloadsByDate: Record<string, number> = {};
    
    data.downloadedAt?.forEach((dateString) => {
      const date = new Date(dateString);
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      downloadsByDate[dateKey] = (downloadsByDate[dateKey] || 0) + 1;
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(downloadsByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Downloads',
          data: sortedDates.map(date => downloadsByDate[date]),
          borderColor: '#ff4262eb',
          backgroundColor: 'rgba(255, 66, 98, 0.1)',
          tension: 0.3,
          pointBackgroundColor: '#ff4262eb',
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#ff4262eb',
          pointHoverBorderColor: '#fff',
          pointHitRadius: 10,
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} download${context.parsed.y !== 1 ? 's' : ''}`;
          },
          title: (context: any) => {
            return context[0].label; // Show full date in tooltip
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function(value: any) {
            // Show abbreviated date format on x-axis
            const date = new Date(this.getLabelForValue(value));
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
    },
  };

  const chartData = prepareChartData();

  return (
    <div 
      className={`hover:bg-[#f5f5f57e] bg-[#f5f5f52d] w-full list-card cursor-pointer flex flex-col justify-center items-center rounded-[8px] p-3 ${isExpanded ? 'h-auto' : ''}`}
      onClick={toggleAccordion}
    >
      <div className="w-full">
        <span title={data.originalName} className="text-lg max-sm:text-base font-medium overflow-hidden w-full text-stone-800">
          {truncateString(data.originalName)}
        </span>
        <div className="flex w-full justify-between items-end">
          <div className="flex justify-start items-center gap-2 text-zinc-500">
            <span className="max-sm:hidden text-sm font-medium text-zinc-700">
              {status} {new Date(data.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="max-sm:hidden">|</span>
            <span className="max-sm:text-xs text-sm font-medium text-zinc-700">
              Downloads: {formatDownloadNumber(data.downloads)}
            </span>
            {data.isExpired && (
              <>
                <span className="text-xs font-normal text-zinc-700">|</span>
                <span className="text-sm font-normal text-zinc-700">
                  Expired
                </span>
              </>
            )}
          </div>
          <div className="flex justify-center items-center">
            <span
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(data.url, data.originalName);
              }}
              className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
            >
              <LuDownload className="size-6 max-sm:size-4" />
              <span className="list-btn-title">Download</span>
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                copyUrl(data.link.id, data.id);
              }}
              className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
            >
              <IoIosLink className="size-6 max-sm:size-4" />
              <span className="list-btn-title">Copy_Link</span>
            </span>
            {status !== 'received' && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile();
                }}
                className="list-btn-title-cont delay-5ms hover:bg-[#32323218] text-stone-800 p-2 rounded-full flex justify-center items-center"
              >
                <IoClose className="size-6 max-sm:size-4" />
                <span className="list-btn-title">Delete</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="w-full mt-3 transition-all duration-200" style={{ height: '150px' }}>
          {data.downloadedAt?.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No download activity recorded
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListCard;