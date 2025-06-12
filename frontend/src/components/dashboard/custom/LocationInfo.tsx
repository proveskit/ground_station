import { DarkCard } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SatInfoProps } from "@/lib/layout";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function LocationInfo({ data }: SatInfoProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
  });

  const center = { lat: data.lat, lng: data.lng };

  return (
    <DarkCard className="h-full p-5">
      <Tabs defaultValue="2d" className="w-full h-full flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="2d">2D View</TabsTrigger>
          <TabsTrigger value="3d">3D View</TabsTrigger>
        </TabsList>
        <TabsContent value="2d" className="flex-1 w-full">
          {isLoaded ? (
            <GoogleMap
              mapContainerClassName="w-full h-full rounded-md"
              center={center}
              options={{
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                disableDefaultUI: true,
              }}
              zoom={17}
            >
              <Marker position={center} />
            </GoogleMap>
          ) : (
            <div>Loading...</div>
          )}
        </TabsContent>
        <TabsContent value="3d" className="flex-1 w-full">
          3D View
        </TabsContent>
      </Tabs>
    </DarkCard>
  );
}
