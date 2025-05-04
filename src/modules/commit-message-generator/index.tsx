"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CommitType {
  value: string;
  label: string;
  description: string;
}

const commitTypes: CommitType[] = [
  { value: "feat", label: "Feature", description: "A new feature" },
  { value: "fix", label: "Fix", description: "A bug fix" },
  { value: "docs", label: "Documentation", description: "Documentation only changes" },
  { value: "style", label: "Style", description: "Changes that do not affect the meaning of the code" },
  { value: "refactor", label: "Refactor", description: "A code change that neither fixes a bug nor adds a feature" },
  { value: "perf", label: "Performance", description: "A code change that improves performance" },
  { value: "test", label: "Test", description: "Adding missing tests or correcting existing tests" },
  { value: "build", label: "Build", description: "Changes that affect the build system or external dependencies" },
  { value: "ci", label: "CI", description: "Changes to our CI configuration files and scripts" },
  { value: "chore", label: "Chore", description: "Other changes that don't modify src or test files" },
  { value: "revert", label: "Revert", description: "Reverts a previous commit" },
];

const CommitMessageGenerator: React.FC = () => {
  const [type, setType] = useState<string>("feat");
  const [scope, setScope] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isBreakingChange, setIsBreakingChange] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const generateCommitMessage = () => {
    if (!subject) return;

    let message = `${type}`;

    if (scope) {
      message += `(${scope})`;
    }

    if (isBreakingChange) {
      message += "!";
    }

    message += `: ${subject}`;

    if (body) {
      message += `\n\n${body}`;
    }

    if (isBreakingChange) {
      message += "\n\nBREAKING CHANGE: This commit introduces breaking changes.";
    }

    setCommitMessage(message);
  };

  const copyToClipboard = () => {
    if (commitMessage) {
      navigator.clipboard.writeText(commitMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setType("feat");
    setScope("");
    setSubject("");
    setBody("");
    setIsBreakingChange(false);
    setCommitMessage("");
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>Commit Message Generator</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Conventional Commit Message</CardTitle>
          <CardDescription>
            Create standardized commit messages following the Conventional Commits specification
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Commit Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder='Select commit type' />
              </SelectTrigger>
              <SelectContent>
                {commitTypes.map((commitType) => (
                  <SelectItem key={commitType.value} value={commitType.value}>
                    <div className='flex flex-col'>
                      <span>
                        {commitType.label} ({commitType.value})
                      </span>
                      <span className='text-xs text-muted-foreground'>{commitType.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Scope (Optional)</label>
            <Input placeholder='e.g., auth, ui, api' value={scope} onChange={(e) => setScope(e.target.value)} />
            <p className='text-xs text-muted-foreground'>The scope provides additional contextual information</p>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Subject (Required)</label>
            <Input
              placeholder='Brief description of the change'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <p className='text-xs text-muted-foreground'>
              Use the imperative mood: &quot;add&quot; not &quot;added&quot; or &quot;adds&quot;
            </p>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Body (Optional)</label>
            <Textarea
              placeholder='Provide additional contextual information about the changes'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className='min-h-[100px]'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='breaking-change'
              checked={isBreakingChange}
              onCheckedChange={(checked) => setIsBreakingChange(checked as boolean)}
            />
            <label
              htmlFor='breaking-change'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              This is a breaking change
            </label>
          </div>

          <div className='flex space-x-2'>
            <Button onClick={generateCommitMessage} disabled={!subject} className='flex-1'>
              Generate Commit Message
            </Button>
            <Button variant='outline' onClick={handleClear}>
              <RotateCcw className='h-4 w-4' />
            </Button>
          </div>

          {commitMessage && (
            <div className='space-y-2 mt-4'>
              <div className='flex justify-between items-center'>
                <label className='text-sm font-medium'>Generated Commit Message</label>
                <Button variant='ghost' size='sm' onClick={copyToClipboard} className='h-8'>
                  <Copy className='h-4 w-4 mr-2' />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className='p-4 border rounded-md bg-muted font-mono whitespace-pre-wrap'>{commitMessage}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommitMessageGenerator;
