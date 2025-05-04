/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Check } from "lucide-react";

const RegexBuilder: React.FC = () => {
  const [regexPattern, setRegexPattern] = useState<string>("");
  const [regexFlags, setRegexFlags] = useState<string>("g");
  const [testString, setTestString] = useState<string>("");
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [replacementPattern, setReplacementPattern] = useState<string>("");
  const [replacementResult, setReplacementResult] = useState<string>("");

  useEffect(() => {
    if (regexPattern && testString) {
      testRegex();
    }
  }, [regexPattern, regexFlags, testString]);

  const testRegex = () => {
    if (!regexPattern) return;

    try {
      const regex = new RegExp(regexPattern, regexFlags);
      const matchResults = testString.match(regex);
      setMatches(matchResults);
      setError(null);

      // Update replacement result
      if (replacementPattern) {
        const replaced = testString.replace(regex, replacementPattern);
        setReplacementResult(replaced);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regular expression");
      setMatches(null);
      setReplacementResult("");
    }
  };

  const toggleFlag = (flag: string) => {
    if (regexFlags.includes(flag)) {
      setRegexFlags(regexFlags.replace(flag, ""));
    } else {
      setRegexFlags(regexFlags + flag);
    }
  };

  const copyToClipboard = () => {
    const regexString = `/${regexPattern}/${regexFlags}`;
    navigator.clipboard.writeText(regexString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplacement = () => {
    if (!regexPattern || !testString) return;

    try {
      const regex = new RegExp(regexPattern, regexFlags);
      const replaced = testString.replace(regex, replacementPattern);
      setReplacementResult(replaced);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regular expression");
    }
  };

  const highlightMatches = () => {
    if (!regexPattern || !testString) return testString;

    try {
      const regex = new RegExp(regexPattern, "g");
      return testString.replace(regex, (match) => `<span class="bg-yellow-200 dark:bg-yellow-800">${match}</span>`);
    } catch {
      return testString;
    }
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>Regex Builder</h1>

      <Card>
        <CardHeader>
          <CardTitle>Regular Expression</CardTitle>
          <CardDescription>Build and test your regular expression pattern</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <div className='text-muted-foreground'>/</div>
            <Input
              placeholder='Pattern'
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              className='font-mono'
            />
            <div className='text-muted-foreground'>/</div>
            <Input
              placeholder='Flags'
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              className='font-mono w-20'
            />
            <Button variant='outline' onClick={copyToClipboard} disabled={!regexPattern} title='Copy regex'>
              {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
            </Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Button
              variant={regexFlags.includes("g") ? "default" : "outline"}
              size='sm'
              onClick={() => toggleFlag("g")}
            >
              g (global)
            </Button>
            <Button
              variant={regexFlags.includes("i") ? "default" : "outline"}
              size='sm'
              onClick={() => toggleFlag("i")}
            >
              i (case insensitive)
            </Button>
            <Button
              variant={regexFlags.includes("m") ? "default" : "outline"}
              size='sm'
              onClick={() => toggleFlag("m")}
            >
              m (multiline)
            </Button>
            <Button
              variant={regexFlags.includes("s") ? "default" : "outline"}
              size='sm'
              onClick={() => toggleFlag("s")}
            >
              s (dotall)
            </Button>
          </div>

          {error && (
            <div className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md'>{error}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test String</CardTitle>
          <CardDescription>Enter text to test against your regular expression</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder='Enter text to test your regex against'
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className='min-h-[100px]'
          />
        </CardContent>
      </Card>

      <Tabs defaultValue='matches'>
        <TabsList>
          <TabsTrigger value='matches'>Matches</TabsTrigger>
          <TabsTrigger value='replace'>Replace</TabsTrigger>
          <TabsTrigger value='highlight'>Highlight</TabsTrigger>
        </TabsList>

        <TabsContent value='matches'>
          <Card>
            <CardHeader>
              <CardTitle>Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {matches && matches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Index</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match, index) => (
                      <TableRow key={index}>
                        <TableCell>{index}</TableCell>
                        <TableCell className='font-mono'>{match}</TableCell>
                        <TableCell>
                          {testString.indexOf(match, index > 0 ? testString.indexOf(matches[index - 1]) + 1 : 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='text-muted-foreground'>No matches found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='replace'>
          <Card>
            <CardHeader>
              <CardTitle>Replace</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Replacement Pattern</label>
                <Input
                  placeholder='$1, $2, etc. for capture groups'
                  value={replacementPattern}
                  onChange={(e) => setReplacementPattern(e.target.value)}
                  className='font-mono'
                />
                <Button onClick={handleReplacement} disabled={!regexPattern || !testString}>
                  Replace
                </Button>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Result</label>
                <div className='p-3 border rounded-md bg-muted min-h-[50px]'>
                  {replacementResult || "No replacement made yet"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='highlight'>
          <Card>
            <CardHeader>
              <CardTitle>Highlighted Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className='p-3 border rounded-md min-h-[100px]'
                dangerouslySetInnerHTML={{ __html: highlightMatches() }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegexBuilder;
