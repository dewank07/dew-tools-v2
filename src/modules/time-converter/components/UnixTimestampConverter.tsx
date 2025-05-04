"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UnixTimestampConverter: React.FC = () => {
  const [unixTimestamp, setUnixTimestamp] = useState<string>("");
  const [humanReadableDate, setHumanReadableDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentUnixTimestamp, setCurrentUnixTimestamp] = useState<number>(0);
  const [timestampUnit, setTimestampUnit] = useState<string>("seconds");
  const [copied, setCopied] = useState<boolean>(false);

  // Update current time and timestamp
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentDate(now.toString());
      setCurrentUnixTimestamp(Math.floor(now.getTime() / 1000));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Set initial unix timestamp to current time
  useEffect(() => {
    setUnixTimestamp(currentUnixTimestamp.toString());
  }, [currentUnixTimestamp]);

  const convertUnixToHuman = () => {
    try {
      if (!unixTimestamp) return;

      let timestamp = parseInt(unixTimestamp);

      // Convert based on unit
      if (timestampUnit === "milliseconds") {
        timestamp = Math.floor(timestamp / 1000);
      }

      const date = new Date(timestamp * 1000);
      setHumanReadableDate(date.toString());
    } catch (error) {
      console.error("Error converting timestamp:", error);
      setHumanReadableDate("Invalid timestamp");
    }
  };

  const convertHumanToUnix = () => {
    try {
      const date = new Date();
      const unixTime = Math.floor(date.getTime() / 1000);

      if (timestampUnit === "milliseconds") {
        setUnixTimestamp((unixTime * 1000).toString());
      } else {
        setUnixTimestamp(unixTime.toString());
      }

      setHumanReadableDate(date.toString());
    } catch (error) {
      console.error("Error getting current timestamp:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert when timestamp or unit changes
  useEffect(() => {
    if (unixTimestamp) {
      convertUnixToHuman();
    }
  }, [unixTimestamp, timestampUnit]);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Unix Timestamp Converter</CardTitle>
        <CardDescription>Convert between Unix timestamps and human-readable dates</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-sm'>Current Unix Timestamp:</p>
          <div className='flex items-center space-x-2'>
            <span className='font-mono'>
              {timestampUnit === "seconds" ? currentUnixTimestamp : currentUnixTimestamp * 1000}
            </span>
            <Button
              variant='ghost'
              size='icon'
              onClick={() =>
                copyToClipboard(
                  timestampUnit === "seconds"
                    ? currentUnixTimestamp.toString()
                    : (currentUnixTimestamp * 1000).toString(),
                )
              }
              title='Copy current timestamp'
            >
              <Copy className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-sm'>Current Date:</p>
          <div className='flex items-center space-x-2'>
            <span>{currentDate}</span>
            <Button variant='ghost' size='icon' onClick={() => copyToClipboard(currentDate)} title='Copy current date'>
              <Copy className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>Timestamp Unit</label>
            <Select value={timestampUnit} onValueChange={setTimestampUnit}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select unit' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='seconds'>Seconds</SelectItem>
                <SelectItem value='milliseconds'>Milliseconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Unix Timestamp</label>
          <div className='flex items-center space-x-2'>
            <Input
              type='number'
              value={unixTimestamp}
              onChange={(e) => setUnixTimestamp(e.target.value)}
              placeholder={`Enter Unix timestamp in ${timestampUnit}`}
            />
            <Button variant='outline' onClick={convertUnixToHuman}>
              Convert
            </Button>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Human-readable Date</label>
          <div className='flex items-center space-x-2'>
            <div className='p-2 border rounded-md flex-1 bg-muted'>{humanReadableDate || "No date converted yet"}</div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => copyToClipboard(humanReadableDate)}
              disabled={!humanReadableDate}
              title='Copy to clipboard'
            >
              <Copy className='h-4 w-4' />
            </Button>
          </div>
          {copied && <p className='text-sm text-green-600'>Copied to clipboard!</p>}
        </div>

        <Button onClick={convertHumanToUnix} className='w-full'>
          Use Current Time
        </Button>
      </CardContent>
    </Card>
  );
};

export default UnixTimestampConverter;
