import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function SatInfo() {
  return (
    <Card className="h-full p-5 grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <CardTitle>Cubesat Name</CardTitle>
        <div className="w-full mt-2 h-58 border-dotted border-2 border-gray-600 rounded-md flex items-center justify-center">
          <p>Image or model or smth will go here</p>
        </div>
        <p>Last packet received: 10 minutes ago</p>
        <Button>View Packet</Button>
      </div>
      <Tabs defaultValue="2d" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="2d">2D View</TabsTrigger>
          <TabsTrigger value="3d">3D View</TabsTrigger>
        </TabsList>
        <TabsContent value="2d">2D View</TabsContent>
        <TabsContent value="3d">3D View</TabsContent>
      </Tabs>
    </Card>
  );
}
