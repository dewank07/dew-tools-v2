"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CityTime {
  city: string;
  timezone: string;
  time: string;
  date: string;
}

const majorCities: { city: string; timezone: string }[] = [
  { city: "New York", timezone: "America/New_York" },
  { city: "London", timezone: "Europe/London" },
  { city: "Tokyo", timezone: "Asia/Tokyo" },
  { city: "Sydney", timezone: "Australia/Sydney" },
  { city: "Paris", timezone: "Europe/Paris" },
  { city: "Dubai", timezone: "Asia/Dubai" },
  { city: "Los Angeles", timezone: "America/Los_Angeles" },
  { city: "Shanghai", timezone: "Asia/Shanghai" },
  { city: "Mumbai", timezone: "Asia/Kolkata" },
  { city: "São Paulo", timezone: "America/Sao_Paulo" },
];

const WorldClock: React.FC = () => {
  const [cityTimes, setCityTimes] = useState<CityTime[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  const updateTimes = () => {
    const now = new Date();

    // Update current UTC time
    setCurrentTime(now.toUTCString());

    // Update all city times
    const times = majorCities.map(({ city, timezone }) => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      const timeFormatter = new Intl.DateTimeFormat("en-US", options);
      const dateFormatter = new Intl.DateTimeFormat("en-US", dateOptions);

      return {
        city,
        timezone,
        time: timeFormatter.format(now),
        date: dateFormatter.format(now),
      };
    });

    setCityTimes(times);
  };

  useEffect(() => {
    // Update times immediately
    updateTimes();

    // Then update every second
    const interval = setInterval(updateTimes, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>World Clock</CardTitle>
        <CardDescription>Current time in major cities around the world</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='text-center mb-4'>
          <p className='text-sm text-muted-foreground'>Current UTC Time</p>
          <p className='text-xl font-semibold'>{currentTime}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityTimes.map((cityTime) => (
              <TableRow key={cityTime.city}>
                <TableCell className='font-medium'>{cityTime.city}</TableCell>
                <TableCell>{cityTime.time}</TableCell>
                <TableCell>{cityTime.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorldClock;
