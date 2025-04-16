"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Custom balloon icon
const balloonIcon = new L.Icon({
  iconUrl: "/balloon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function getHourLabelFromOffset(hourOffset: string): string {
  const now = new Date();
  const offset = parseInt(hourOffset);

  // Clone the current time
  const time = new Date(now.getTime());
  time.setHours(time.getHours() - offset);

  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function BalloonMap() {
  const [hour, setHour] = useState<string>("00");
  const [balloons, setBalloons] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    const fetchHourData = async () => {
      try {
        const res = await fetch(`/api/balloon/${hour}`);
        const text = await res.text();

        let data: any[];
        try {
          data = JSON.parse(text);
        } catch {
          console.warn(`Skipping ${hour}.json due to invalid JSON`);
          return;
        }

        const coords: Array<[number, number]> = [];

        data.forEach((entry: any) => {
          const [lat, lon] = entry;
          if (typeof lat === "number" && typeof lon === "number") {
            coords.push([lat, lon]);
          }
        });

        setBalloons(coords);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    fetchHourData();
  }, [hour]);

  return (
    <div className="bg-white h-screen">
      {/* Dropdown overlay */}
      <div className=" top-0 bg-white text-black p-3 rounded-lg shadow-md">
        <div className="flex justify-between gap-8">
          <label className="font-bold text-blue-950">windborne-Tracker</label>
          <div className="flex gap-8">
            <label className="block text-sm text-gray-700 font-medium">
              Select Time:{" "}
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const value = i.toString().padStart(2, "0");
                  return (
                    <option key={value} value={value}>
                      {getHourLabelFromOffset(value)}
                    </option>
                  );
                })}
              </select>
            </label>
            <a
              href="https://github.com/belanasaikiran/windborne-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex pr-2"
            >
              Source Code{" "}
              <span>
                {" "}
                <img
                  src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                  alt="GitHub"
                  className="mr-2 h-[24px] w-[24px]"
                />{" "}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[37.8, -96]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        worldCopyJump={false}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {balloons.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={balloonIcon}>
            <Tooltip direction="top" offset={[0, -10]} permanent>
              Balloon #{idx + 1}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
