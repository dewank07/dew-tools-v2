import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import WorldClock from "./components/WorldClock";
import TimezoneConverter from "./components/TimezoneConverter";
import UnixTimestampConverter from "./components/UnixTimestampConverter";

const TimeConverter: React.FC = () => {
  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold'>Time Converter</h1>

      <Tabs defaultValue='world-clock'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='world-clock'>World Clock</TabsTrigger>
          <TabsTrigger value='timezone-converter'>Timezone Converter</TabsTrigger>
          <TabsTrigger value='unix-timestamp'>Unix Timestamp</TabsTrigger>
        </TabsList>

        <TabsContent value='world-clock'>
          <WorldClock />
        </TabsContent>

        <TabsContent value='timezone-converter'>
          <TimezoneConverter />
        </TabsContent>

        <TabsContent value='unix-timestamp'>
          <UnixTimestampConverter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeConverter;
