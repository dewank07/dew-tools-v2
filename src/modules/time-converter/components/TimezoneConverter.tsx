/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface Timezone {
  name: string;
  value: string;
}

const timezones: Timezone[] = [
  { name: "UTC", value: "UTC" },
  { name: "New York (EST/EDT)", value: "America/New_York" },
  { name: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
  { name: "London (GMT/BST)", value: "Europe/London" },
  { name: "Paris (CET/CEST)", value: "Europe/Paris" },
  { name: "Tokyo (JST)", value: "Asia/Tokyo" },
  { name: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  { name: "Dubai (GST)", value: "Asia/Dubai" },
  { name: "Shanghai (CST)", value: "Asia/Shanghai" },
  { name: "Mumbai (IST)", value: "Asia/Kolkata" },
  { name: "São Paulo (BRT)", value: "America/Sao_Paulo" },
];

const TimezoneConverter: React.FC = () => {
  const [sourceTimezone, setSourceTimezone] = useState<string>("UTC");
  const [targetTimezone, setTargetTimezone] = useState<string>("America/New_York");
  const [sourceTime, setSourceTime] = useState<string>("");
  const [convertedTime, setConvertedTime] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Set default source time to current time
    const now = new Date();
    const timeString = now.toISOString().substring(0, 16);
    setSourceTime(timeString);
  }, []);

  const convertTime = () => {
    try {
      if (!sourceTime) return;

      // Parse the source time
      const sourceDate = new Date(sourceTime);

      // Format the time in the target timezone
      const options: Intl.DateTimeFormatOptions = {
        timeZone: targetTimezone,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };

      // Convert to target timezone
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const targetTime = formatter.format(sourceDate);

      setConvertedTime(targetTime);
    } catch (error) {
      console.error("Error converting time:", error);
      setConvertedTime("Invalid time format");
    }
  };

  const copyToClipboard = () => {
    if (convertedTime) {
      navigator.clipboard.writeText(convertedTime);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Convert time when source time or timezones change
  useEffect(() => {
    convertTime();
  }, [sourceTime, sourceTimezone, targetTimezone]);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Timezone Converter</CardTitle>
        <CardDescription>Convert times between different timezones</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Source Timezone</label>
          <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
            <SelectTrigger>
              <SelectValue placeholder='Select source timezone' />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Source Time</label>
          <Input type='datetime-local' value={sourceTime} onChange={(e) => setSourceTime(e.target.value)} />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Target Timezone</label>
          <Select value={targetTimezone} onValueChange={setTargetTimezone}>
            <SelectTrigger>
              <SelectValue placeholder='Select target timezone' />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Converted Time</label>
          <div className='flex items-center space-x-2'>
            <div className='p-2 border rounded-md flex-1 bg-muted'>{convertedTime || "No time converted yet"}</div>
            <Button
              variant='outline'
              size='icon'
              onClick={copyToClipboard}
              disabled={!convertedTime}
              title='Copy to clipboard'
            >
              <Copy className='h-4 w-4' />
            </Button>
          </div>
          {copied && <p className='text-sm text-green-600'>Copied to clipboard!</p>}
        </div>

        <Button onClick={convertTime} className='w-full'>
          Convert
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimezoneConverter;
